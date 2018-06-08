const UserModel = require('./../models/user')
const DatabaseModel = require('./../models/database')
const Engine = require('./../core/engine')
const functions = require('./../core/functions')
const PermChecker = require('./../components/PermissionChecker')
const conf = require('./../core/config')

module.exports = {

    path: '/databases',

    register: function (app) {

        // list user databases
        app.get(this.path + '/list', PermChecker.isAuthorized(), (req, res) => {

            DatabaseModel.getByUser(req.user.username, (err, list) => {
                res.send(list)
            })

        })

        // create new database
        app.post(this.path, PermChecker.isAuthorized(), (req, res) => {

            const result = DatabaseModel.validate(req.body)

            if (result === true) { // all good

                DatabaseModel.getByUser(req.user.username, (err, result) => {

                    if (result.indexOf(req.body.name) != -1) {
                        res.status(400).send('database already exists')
                    } else {

                        DatabaseModel.create(req.user.username, req.body.name, (added) => {

                            res.send(req.body.name);

                        })

                    }

                })

            } else {
                res.status(400).send(result.details[0].message)
            }

        })

    }
}