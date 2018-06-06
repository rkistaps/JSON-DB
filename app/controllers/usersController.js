const Joi = require('joi')
const UserModel = require('./../models/user')
const PermissionCheck = require('./../components/permissionCheck')
const functions = require('./../core/functions')

module.exports = {

    register: function (app) {

        // list users
        app.get('/users', function (req, res) {

            res.send('hi');

        })

        // create a new user
        app.post('/users', function (req, res) {

            const schema = UserModel.getSchema()
            const result = Joi.validate(req.body, schema)

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

                            let User = {}
                            for (let i in schema) {
                                User[i] = req.body[i]
                            }

                            User.password = hash

                            res.send(User)
                        })


                    }

                })

            }

        })

    }

}