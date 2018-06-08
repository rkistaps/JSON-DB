const UserModel = require('./../models/user')
const Engine = require('./../core/engine')
const functions = require('./../core/functions')
const PermChecker = require('./../components/PermissionChecker')

module.exports = {

    path: '/users',

    register: function (app) {

        // list users
        app.get(this.path, PermChecker.hasPermission('list_users'), (req, res) => {

            UserModel.getAll(function (err, data) {

                if (err) {
                    res.status(500).send('Internal error')
                } else {
                    res.send(data)
                }

            })

        })

        // get one user
        app.get(this.path + '/:username', PermChecker.hasPermission('list_users'), (req, res) => {

            UserModel.get(req.params.username, function (err, data) {

                if (err) {
                    res.status(500).send('Internal error')
                } else {

                    if (data) {
                        res.send(data)
                    } else {
                        res.status(400).send("User not found")
                    }

                }

            })

        })



        // create a new user
        app.post(this.path, PermChecker.hasPermission('create_users'), function (req, res) {

            const result = UserModel.validate(req.body);

            if (result === true) { // all good

                UserModel.get(req.body.username, function (err, user) {

                    if (err) {
                        res.status(500).send(err)
                    } else if (user) {
                        res.status(400).send("Username already taken")
                    } else {

                        functions.cryptPassword(req.body.password, function (err, hash) {

                            let User = req.body
                            User.password = hash

                            UserModel.create(User, function (err, user) {

                                if (err) {
                                    res.status(400).send(err)
                                } else {
                                    res.send(User)
                                }

                            })

                        })

                    }

                })

            } else { // validation error
                res.status(400).send(result.details[0].message)
            }

        })

    }

}