'use strict'

//The validation constraints added to db schema fields
// will throw error messages, if violated when data is saved to db.
// To handle these validation errors and other errors
// that the database may throw when we make queries to it,
// we will define a helper method to return a relevant error message
// that can be propagated in the request-response cycle as appropriate.
// This method getErrorMessage will parse and return the
// error message associated with the specific validation error or other error that occurred
// while querying MongoDB using Mongoose.

/**
 * Get unique error field name
 */
// Errors that are not thrown because of a Mongoose validator violation will contain an error
// code and in some cases need to be handled differently. For example, errors caused due to a
// violation of the unique constraint will return a different error object than Mongoose
// validation errors. The unique option is not a validator but a convenient helper for building
// MongoDB unique indexes, and thus we will add another
// getUniqueErrorMessage method to parse the unique constraint related error object
// and construct appropriate meaningful error messages when handling errors
// thrown by Mongoose operations performed for db CRUD.
const getUniqueErrorMessage = (err) => {
    let output
    try {
        let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'))
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
    } catch (ex) {
        output = 'Unique field already exists'
    }

    return output
}

/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
    let message = ''

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
                break
            default:
                message = 'Something went wrong'
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message
        }
    }

    return message
}

export default {getErrorMessage}
