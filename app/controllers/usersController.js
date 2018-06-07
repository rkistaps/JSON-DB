const UserModel = require('./../models/user')
const Engine = require('./../core/engine')
const functions = require('./../core/functions')
const PermChecker = require('./../components/PermissionChecker')

module.exports = {

    register: function (app) {

        // list users
        app.get('/users', function (req, res) {

            res.send('hi');

        })

        // create a new user
        app.post('/users', PermChecker.hasPermission('create_users'), function (req, res) {

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