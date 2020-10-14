const config = {
    env: process.env.NODE_ENV || 'development', // differentiate between development and production mode
    port: process.env.PORT || 3000, // define the listening port for the server
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", // secret key to be used to sign JWT
    mongoUri: process.env.MONGODB_URI ||
        process.env.MONGO_HOST ||
        'mongodb://' + (process.env.IP || 'localhost') + ':' +
        (process.env.MONGO_PORT || '27017') +
        '/dbname' // location of the MongoDB database for the project
}

export default config
