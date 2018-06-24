const PermChecker = require('./../components/PermissionChecker')
const DatabaseModel = require('./../models/database')
const Engine = require('./../core/engine')
const messages = require('./../components/messages')
const Joi = require('joi')

module.exports = {

    register: function (app) {

        app.post("/unset/:database", PermChecker.isAuthorized(), (req, res) => {

            const schema = {
                path: Joi.string().min(1).required()
            }

            const result = Joi.validate(req.body, schema)

            console.log(result.error)

            if (!result.error) {

                DatabaseModel.hasDatabase(req.user.username, req.params.database)
                    .then((result) => {
                        if (result) {

                            DatabaseModel.unsetData(req.user.username, req.params.database, req.body.path)
                                .then((result) => {

                                    res.send('1')

                                })
                                .catch((err) => {
                                    res.status(500).send(messages.internalError)
                                })


                        } else {
                            res.status(400).send(messages.databaseNotFound)
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(messages.internalError)
                    })
            } else {

                res.status(400).send(result.error.details[0].message)

            }

        })

        app.post("/set/:database", PermChecker.isAuthorized(), (req, res) => {

            const schema = {
                path: Joi.string().min(1).required(),
                data: Joi.required()
            }

            const result = Joi.validate(req.body, schema)

            if (result.error) {

                res.status(400).send(result.error.details[0].message)

            } else {

                DatabaseModel.hasDatabase(req.user.username, req.params.database)
                    .then((result) => {
                        if (result) {

                            DatabaseModel.setData(req.user.username, req.params.database, req.body.path, req.body.data)
                                .then((result) => {

                                    res.send(req.body.data)

                                })
                                .catch((err) => {
                                    res.status(500).send(messages.internalError)
                                })


                        } else {
                            res.status(400).send(messages.databaseNotFound)
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(messages.internalError)
                    })

            }

        })

        app.post("/get/:database", PermChecker.isAuthorized(), (req, res) => {

            const result = Joi.validate(req.body, {
                path: Joi.string().min(1).required()
            })

            if (result.error) {
                res.status(400).send(result.error.details[0].message)
            } else {

                DatabaseModel.hasDatabase(req.user.username, req.params.database)
                    .then((result) => {
                        if (result) {

                            DatabaseModel.getData(req.user.username, req.params.database, req.body.path)
                                .then((result) => {

                                    res.send(result)

                                })
                                .catch((err) => {
                                    res.status(500).send(messages.internalError)
                                })


                        } else {
                            res.status(400).send(messages.databaseNotFound)
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(messages.internalError)
                    })

            }

        })

    }

}