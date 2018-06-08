const conf = require('./../core/config')
const Engine = require('./../core/engine')
const Joi = require('joi')

module.exports = {

    path: '/users',

    schema: {
        username: Joi.string().min(3).required(),
        password: Joi.string().min(3).required(),
    },

    get: function (username, callback) {

        Engine.queryCoreDb(this.path + '/' + username, function (err, data) {

            callback(err, data)

        })

    },

    getAll: function (callback) {

        Engine.queryCoreDb(this.path, function (err, data) {

            callback(err, data)

        })

    },

    validate: function (user) {

        const result = Joi.validate(user, this.schema)

        if (result.error) {
            return result.error
        } else {
            return true;
        }

    },

    create: function (user, callback) {

        if (typeof user.permissions === 'undefined') {
            user.permissions = []
        }

        Engine.addUser(user, function (added) {

            callback(added ? user : false)

        })

    },

    delete: (username, callback) => {

        callback(username)

    }

}