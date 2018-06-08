const conf = require('./../core/config')
const Engine = require('./../core/engine')
const Joi = require('joi')

module.exports = {

    path: '/databases',

    schema: {
        name: Joi.string().min(3).required(),
    },

    validate: function (data) {

        const result = Joi.validate(data, this.schema)

        if (result.error) {
            return result.error
        } else {
            return true;
        }

    },

    create: function (username, name, callback) {

        Engine.addDatabase(username, name, (added) => {
            callback(added)
        })

    },

    getByUser: function (user, callback) {

        Engine.queryCoreDb(this.path + '/' + user, (err, result) => {

            callback(err, result)

        })

    }

}