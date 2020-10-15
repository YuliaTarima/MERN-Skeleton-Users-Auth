import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

// User controller contains the controller methods
// used in the user route declarations server/routes/user.routes.js
// as callbacks when a route request is received by the server.

// The controller will make use of the errorHandler helper
// to respond to the route requests
// with meaningful messages when a Mongoose error occurs.

// Each of the controller functions is related to a route request,
// and will be elaborated on in relation to each API use case.

const create = async (req, res) => {
    // creates a new user with the user JSON object received in the POST request
    // from the frontend within req.body
    // The user.save attempts to save the new user into the
    // database after Mongoose does a validation check on the data
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// find all the users from the database,
// populate only the name, email, created and updated fields in the resulting user list,
// return this user list as JSON objects in an array to the requesting client.
const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**
 * Load user and append to req.
 */
// API endpoints for read, update, and delete
// require a user to be retrieved from the database based on the user ID.
// Express router will do this action first before responding to the specific
// request to read, update, or delete.

// use value in the :userId param to query the db by _id.
// If matching user in db, append user obj to request obj in the profile key.
// Then, the next() middleware call in userById is used to propagate control
// to the next relevant controller function.
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

// The read function retrieves the user details from req.profile
// removes sensitive information, such as the hashed_password and salt values,
// before sending the user object in the response to the requesting client.
const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

// The update function retrieves the user details from req.profile,
// uses lodash module to extend and merge changes
// that came in the request body to update the user data.
// Before saving updated user to db, the updated field is populated with
// the current date to reflect the last updated at timestamp.
// On successful save of this update, the updated user object is cleaned
// by removing the sensitive data, such as hashed_password and salt,
// before sending the user object in the response to the requesting client.
const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// retrieves user from req.profile and deletes user from db with remove() query
// On successful deletion, return deleted user obj in the response to requesting client
const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    create,
    userByID,
    read,
    list,
    remove,
    update
}
