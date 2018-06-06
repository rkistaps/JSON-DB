const Joi = require('joi')
const UserModel = require('./../models/user')
const PermissionCheck = require('./../components/permissionCheck')
const Engine = require('./../core/engine')
const functions = require('./../core/functions')

module.exports = {

    register: function (app) {

        // list users
        app.get('/users', function (req, res) {

            res.send('hi');

        })

        // create a new user
        app.post('/users', function (req, res) {

            const result = Joi.validate(req.body, UserModel.schema)

            if (result.error) {
                res.status(400).send(result.error.details[0].message)
            } else {

                UserModel.get(req.body.username, function (err, user) {

                    if (err) {
                        res.status(500).send(err)
                    } else if (user) {
                        res.status(400).send("Username already taken")
                    } else {

                        functions.cryptPassword(req.body.password, function (err, hash) {

                            let User = req.body
                            User.password = hash

                            Engine.addUser(User, function (err, added) {
                                res.send(User)
                            })

                        })

                    }

                })

            }

        })

    }

}