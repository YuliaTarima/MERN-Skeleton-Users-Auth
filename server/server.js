import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'
// import {MongoClient} from 'mongodb'


/**
 * listen on the specified port for incoming requests
 */
let port = config.port // process.env.PORT || 3000
app.listen(port, function onStart(err) {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', port)
})

/**
 * connect Node server to MongoDB (MongoDB should be running)
 */
const mongoUrl = config.mongoUri // process.env.MONGODB_URI||'mongodb://localhost:27017/dbname'
// connect with Mongoose - Object Data Modeling (ODM) library for MongoDB
// This Object Data Mapper  manages relationships between data,
// provides schema validation,
// and is used to translate between objects in code and the representation of those objects in MongoDB.
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUrl}`)
})

// // MongoClient - driver that connects to running MongoDB instance with url
// const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/dbname'
// MongoClient.connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, (err, db) => {
//     console.log("Connected successfully to mongodb server")
//     db.close()
// })
