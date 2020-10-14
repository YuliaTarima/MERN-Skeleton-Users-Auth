import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    // mongoose.Schema function takes a schema definition object as a parameter
    // to generate a new Mongoose schema object
    // declares all the user data fields and associated properties
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },

    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },

    // The hashed_password and salt fields
    // represent the encrypted user password used for authentication
    // The actual password string is not stored directly in the database
    // for security purposes and is handled separately
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String,

    // Created and updated timestamps
    // are Date values that will be programmatically generated
    // to record timestamps for a user being created and updated
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
})

// Password needs to be encrypted, validated, and authenticated securely
// as a part of the user model.
UserSchema
    // User password string is not stored directly in the user document.
    // Instead, it is handled as a virtual field.
    .virtual('password')
    .set(function (password) {
        this._password = password
        // When the password value is received on user creation or update,
        // it is encrypted into a new hashed value and set to the
        // hashed_password field,
        // along with the salt value in the salt field.
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

// To add validation constraints on the actual password string selected by the end user,
// we will need to add custom validation logic
// and associate it with the hashed_password field in the schema.
UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        // To ensure that a password value is indeed provided, and has a length of at least six
        // characters when a new user is created or existing password is updated, custom validation is
        // added to check the password value before Mongoose attempts to store the
        // hashed_password value. If validation fails, the logic will return the relevant error
        // message.
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

UserSchema.methods = {
    // When the password value is received on user creation or update,
    // it is encrypted into a new hashed value and set to the hashed_password field,
    // along with the salt value in the salt field.

    // Both the hashed_password and salt values are required in order to
    // match and authenticate a password string provided during user sign-in,
    // using the authenticate method
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

export default mongoose.model('User', UserSchema)
