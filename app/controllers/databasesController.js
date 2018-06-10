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
        app.get(this.path, PermChecker.isAuthorized(), (req, res) => {


            DatabaseModel.getByUser(req.user.username)
                .then((list) => {
                    res.send(list)
                })
                .catch((err) => {
                    res.status(500).send('Internal server error. Refer to error log')
                })

        })

        // create new database
        app.post(this.path, PermChecker.isAuthorized(), (req, res) => {

            const username = req.user.username
            const database = req.body.name
            const result = DatabaseModel.validate(req.body)

            if (result === true) { // all good

                DatabaseModel.getByUser(username)
                    .then((databases) => {

                        if (databases.indexOf(database) != -1) {
                            res.status(400).send('database already exists')
                        } else {
                            DatabaseModel.create(username, database)
                                .then((result) => {
                                    res.send(result)
                                })
                                .catch((err) => {
                                    console.log(err)
                                    res.status(500).send('Internal server error')
                                })
                        }

                    }).catch((e) => {
                        res.status(500).send('Interanl server error. Refer to error log')
                    })


                // DatabaseModel.getByUser(username, (err, result) => {

                //     if (result.indexOf(database) != -1) {
                //         res.status(400).send('database already exists')
                //     } else {

                //         DatabaseModel.create(username, database, (added) => {

                //             res.send(database);

                //         })

                //     }

                // })

            } else {
                res.status(400).send(result.details[0].message)
            }

        })

        // delete
        app.delete(this.path + "/:database", PermChecker.isAuthorized(), (req, res) => {

            var username = req.user.username
            var database = req.params.database

            DatabaseModel.hasDatabase(username, database)
                .then((has) => {

                    if (has) {

                        DatabaseModel.delete(req.user.username, req.params.database)
                            .then((result) => {
                                res.send(result)
                            })

                    } else {

                        res.status(400).send('database not found')

                    }


                }).catch((err) => {
                    console.log(err)
                    res.send(err)
                })

        })

    }
}