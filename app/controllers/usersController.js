const UserModel = require('./../models/user')
const Engine = require('./../core/engine')
const functions = require('./../core/functions')
const PermChecker = require('./../components/PermissionChecker')
const conf = require('./../core/config')
const messages = require('./../components/messages')

module.exports = {

    path: '/users',

    register: function (app) {

        // list users
        app.get(this.path, PermChecker.hasPermission('list_users'), (req, res) => {

            UserModel.getAll()
                .then((users) => {
                    res.send(users)
                })
                .catch((err) => {
                    res.status(500).send('Internal server error. Refer to error log')
                })

        })

        // get one user
        app.get(this.path + '/:username', PermChecker.hasPermission('list_users'), (req, res) => {

            UserModel.get(req.params.username)
                .then((user) => {
                    if (user) {
                        res.send(user)
                    } else {
                        res.status(400).send('user not found')
                    }
                })
                .catch((err) => {
                    res.status(500).send('Internal server error. Refer to error log')
                })

        })

        // create a new user
        app.post(this.path, PermChecker.hasPermission('create_users'), function (req, res) {

            const result = UserModel.validate(req.body);

            if (result === true) { // all good

                UserModel.get(req.body.username)
                    .then((user) => {

                        if (user) {
                            res.status(400).send("Username already taken")
                        } else {

                            functions.cryptPassword(req.body.password, function (err, hash) {

                                let User = req.body
                                User.password = hash

                                UserModel.create(User)
                                    .then((result) => {
                                        res.send(result)
                                    })
                                    .catch((err) => {
                                        res.status(500).send('Internal server errro. Refer to error log')
                                    })

                            })

                        }

                    })
                    .catch((err) => {
                        res.status(500).send('Internal server error. Refer to error log')
                    })


                UserModel.get(req.body.username, function (err, user) {

                    if (err) {
                        res.status(500).send(err)
                    } else if (user) {
                        res.status(400).send("Username already taken")
                    } else {

                        functions.cryptPassword(req.body.password, function (err, hash) {

                            let User = req.body
                            User.password = hash

                            UserModel.create(User, function (created) {

                                if (created) {
                                    res.send(User)
                                } else {
                                    res.status(400).send('User was not created')
                                }

                            })

                        })

                    }

                })

            } else { // validation error
                res.status(400).send(result.details[0].message)
            }

        })

        // delete user
        app.delete(this.path + '/:username', PermChecker.hasPermission('delete_users'), (req, res) => {

            if (req.params.username != req.user.username) {

                if (req.params.username != conf.engine.coreUser) {

                    UserModel.delete(req.params.username)
                        .then((result) => {
                            res.send(result)
                        })
                        .catch((err) => {
                            console.log(err);

                            res.status(500).send(messages.internalError)
                        })

                } else {
                    res.status(400).send('Cant delete root user')
                }

            } else {
                res.status(400).send('Cant delete yourself')
            }

        })

    }

}