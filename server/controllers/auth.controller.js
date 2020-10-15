import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

// auth.controller.js handles requests to the sign-in and sign-out routes.
// and provides JWT and express-jwt functionality
// to enable authentication and authorization for protected user API endpoints.

// To protect access to the read, update, and delete routes,
// server checks that requesting client is authenticated and authorized user.
// To check if the requesting user is signed in and has a valid JWT
// when a protected route is accessed, we will use the express-jwt module.
// express-jwt module is middleware that validates JSON Web Tokens.

const signin = async (req, res) => {
// The POST request object receives the email and password in req.body.
// This email is used to retrieve a matching user from the database.
// Then, the password authentication method defined in the UserSchema
// is used to verify the password received in the req.body from the client.
// If the password is successfully verified, the JWT module generates a JWT
// signed using a secret key and the user's _id value.

// Then, the signed JWT is returned to the authenticated client along with user details.
// Optionally, if cookies is the chosen form of JWT storage,
// we can set the token to a cookie in the response object so it is available to the client side .
// On the client side, this token must be attached as an Authorization header
// when requesting protected routes from the server.
    try {
        let user = await User.findOne({
            "email": req.body.email
        })
        if (!user)
            return res.status('401').json({
                error: "User not found"
            })

        if (!user.authenticate(req.body.password)) {
            return res.status('401').send({
                error: "Email and password don't match."
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, config.jwtSecret)

        res.cookie("t", token, {
            expire: new Date() + 9999
        })

        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (err) {

        return res.status('401').json({
            error: "Could not sign in"
        })

    }
}

// The signout function clears the response cookie containing the signed JWT.
// This is an optional endpoint and not really necessary for auth purposes
// if cookies are not used at all in the frontend.
// With JWT, user state storage is the client's responsibility,
// and there are multiple options for client-side storage besides cookies.
// On sign-out, the client needs to delete the token on the client side
// to establish that the user is no longer authenticated.
const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

// add requireSignin to any route that should be protected against unauthenticated
// access.
// The requireSignin method uses express-jwt to verify
// that the incoming request has a valid JWT in the Authorization header.
// If valid token, append verified user's ID in 'auth' key to request object,
// otherwise it throw authentication error.
const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256']
})

// Add hasAuthorization function to routes that require both authentication
// and authorization.

// For some of the protected routes such as update and delete,
// on top of checking for authentication we also want to make sure
// the requesting user is only updating or deleting their own user information.
// To achieve this, the hasAuthorization function checks
// if the authenticated user is the same as the user being updated or deleted
// before the corresponding CRUD controller function is allowed to proceed.

// req.auth is populated by express-jwt in requireSignin after auth verification,
// req.profile is populated by userByID function in the user.controller.js.
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}
