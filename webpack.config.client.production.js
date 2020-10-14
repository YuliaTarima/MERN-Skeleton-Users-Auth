const path = require('path')
const CURRENT_WORKING_DIR = process.cwd()

const config = {
    mode: "production",
    entry: [
        // specifies the entry file where Webpack starts bundling
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        // specifies the output path for the bundled code
        path: path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: "/dist/" // allows specifying the base path for all assets in the application
    },
    module: {
        rules: [
            // sets the regex rule for the file extension to be used for transpilation,
            // and the folders to be excluded.
            // The transpilation tool to be used here is babel loader.
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    }
}

module.exports = config