const conf = require('./../core/config')
const Engine = require('./../core/engine')
const Joi = require('joi')

module.exports = {

    path: 'permissions',

    schema: {
        name: Joi.string().min(3).required(),
    },


    getAll: function (callback) {

        Engine.queryCoreDb('/' + this.path, function (err, data) {

            callback(err, data)

        })

    }

}