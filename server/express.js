import express from 'express'
import path from 'path'
import Template from './../template'
// Webpack will compile and bundle the React code into dist/bundle.js.
import devBundle from './devBundle' // comment before building for production

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

// Routing
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

// modules for server side rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import {StaticRouter} from 'react-router-dom'
import {ServerStyleSheets, ThemeProvider} from '@material-ui/styles'
import theme from './../client/theme'
// end ssr modules

const app = express()
devBundle.compile(app) // dev mode only, comment before building for production

/**
 * Middleware
 */
// parse body params and attach them to req.body
// Body parsing middleware handling the complexities of parsing streamable
// request objects, so we can simplify browser-server communication by
// exchanging JSON in the request body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Cookie parsing middleware to parse and set cookies in request
// objects
app.use(cookieParser())

// Compression middleware that will attempt to compress response
// bodies for all requests that traverse through the middleware
app.use(compress())

// A collection of middleware functions
// to help secure Express apps by setting various HTTP headers
app.use(helmet())

// Middleware to enable CORS - Cross Origin Resource Sharing
app.use(cors())

const CURRENT_WORKING_DIR = process.cwd()
// Webpack will compile client-side code in both development and production mode,
// then place the bundled files in the dist folder.
// To make these static files available on requests from the client side:
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

/**
 * Mount routes
 */
// The user API endpoints exposed by the Express app will allow the frontend to do CRUD
// operations on the documents generated according to the user model. To implement these
// working endpoints, we will write Express routes and corresponding controller callback
// functions that should be executed when HTTP requests come in for these declared routes.
app.use('/', userRoutes)
app.use('/', authRoutes)

app.get('*', (req, res) => {
    const sheets = new ServerStyleSheets()
    const context = {}
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter/>
                </ThemeProvider>
            </StaticRouter>
        )
    )
    if (context.url) {
        return res.redirect(303, context.url)
    }
    const css = sheets.toString()
    // When server receives a request, render template.js in the browser.
    res.status(200).send(Template({
        markup: markup,
        css: css
    }))
})

/**
 * Catch unauthorised errors
 */
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error": err.name + ": " + err.message})
    } else if (err) {
        res.status(400).json({"error": err.name + ": " + err.message})
        console.log(err)
    }
})

export default app
