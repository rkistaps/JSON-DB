const PermChecker = require('./../components/PermissionChecker')
const DatabaseModel = require('./../models/database')
const Engine = require('./../core/engine')
const Joi = require('joi')

module.exports = {

    register: function (app) {

        app.post("/set/:database", PermChecker.isAuthorized(), (req, res) => {

            const schema = {
                path: Joi.string().min(1).required(),
                data: Joi.required()
            }

            const result = Joi.validate(req.body, schema)

            if (result.error) {

                res.status(400).send(result.error.details[0].message)

            } else {

                DatabaseModel.hasDatabase(req.user.username, req.params.database, (has) => {

                    if (has) {

                        DatabaseModel.set(req.user.username, req.params.database, req.body.path, req.body.data, () => {
                            res.send(req.body)
                        })

                    } else {
                        res.status(400).send("database does not exist")
                    }

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

                DatabaseModel.hasDatabase(req.user.username, req.params.database, (has) => {

                    if (has) {

                        DatabaseModel.get(req.user.username, req.params.database, req.body.path, (err, data) => {
                            res.send(data)
                        })

                    } else {
                        res.status(400).send("database does not exist")
                    }

                })

            }

        })

    }


}