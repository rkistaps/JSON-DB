const conf = require('./../core/config')
const engine = require('./../core/engine')
const Joi = require('joi')

module.exports = {

    getSchema: function () {

        return {
            username: Joi.string().min(3).required(),
            password: Joi.string().min(3).required(),
        }

    },

    get: function (username, callback) {

        engine.queryCoreDb('/users/' + username, function (err, data) {

            callback(err, data)

        })

    }

}