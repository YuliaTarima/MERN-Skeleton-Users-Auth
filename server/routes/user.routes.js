import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

// The user routes will use express.Router()
// to declare the route paths with relevant HTTP methods,
// and assign the corresponding controller function
// that should be called when these requests are received by the server.
const router = express.Router()

router.route('/api/users')
    // When the Express app gets a GET request at '/api/users',
    // it executes the list controller function.
    .get(userCtrl.list)
    // When the Express app gets a POST request at '/api/users',
    // call create function defined in user controller
    .post(userCtrl.create)

// Whenever the Express app receives a request to a route with :userId param in it,
// the app will first execute the userByID controller function before
// propagating to the next function specific to the request that came in
router.param('userId', userCtrl.userByID)

router.route('/api/users/:userId')
    // When the Express app gets a GET request at '/api/users/:userId',
    // it executes the userByID controller function to load user by userId value in the param,
    // and then the read controller function.
    .get(authCtrl.requireSignin, userCtrl.read)
    // When the Express app gets a PUT request at '/api/users/:userId',
    // it first loads the user with the :userId param value from userByID controller,
    // and then the update controller function is executed.
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    // When the Express app gets a DELETE request at '/api/users/:userId',
    // it first loads the user by ID with the :userId param value from userByID controller,
    // and then the remove controller function is executed.
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)


export default router
