const conf = require('./../core/config')
const Engine = require('./../core/engine')
const UserModel = require('./../models/user')
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

    },

    exists: function (name, callback) {

        this.getAll(function (err, data) {

            if (data.indexOf(name) != -1) {
                callback(true)
            } else {
                callback(false)
            }

        })

    },

    validate: function (data) {

        const result = Joi.validate(data, this.schema)

        if (result.error) {
            return result.error
        } else {
            return true;
        }

    },

    grant: function (body, callback) {

        const schema = {
            user: Joi.string().required(),
            permissions: Joi.array().required()
        }

        const result = Joi.validate(body, schema)

        if (result.error) {
            callback(result.error.details[0].message)
        } else {

            if (body.permissions.indexOf('root') !== -1) {
                callback('Cant grant root permission')
            } else {

                UserModel.get(body.username, (err, user) => {

                    if (user) {

                        Engine.setCoreByPath('/users/' + user.username + '/permissions', body.permissions, () => {
                            callback(false, body)
                        })

                    } else {

                        callback('User not found')

                    }

                });

            }

        }

    },

    create: function (permission, callback) {

        const result = this.validate(permission)
        const self = this

        if (result === true) {

            this.exists(permission.name, function (exists) {

                if (exists) {
                    callback('permission already exists')
                } else { // do not exist

                    self.getAll(function (err, data) {

                        data.push(permission.name)
                        Engine.setCoreByPath(self.path, data, function (result) {

                            if (result) {
                                callback(false, permission)
                            } else {
                                callback('error')
                            }

                        })

                    })

                }

            })

        } else {
            callback(result.details[0].message)
        }

    }

}