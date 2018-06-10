const jwt = require('jsonwebtoken')
const functions = require('./../core/functions')
const engine = require('./../core/engine')
const UserModel = require('./../models/user')
const conf = require('./../core/config')
const Joi = require('joi')
const messages = require('./../components/messages')

const schema = {
    username: Joi.string().required(),
    password: Joi.string().required()
}

module.exports.auth = function (req, res) {

    const result = Joi.validate(req.body, schema)

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } else {

        UserModel.get(req.body.username)
            .then((user) => {
                if (user) {

                    // res.send(result)

                    functions.comparePasswordPromise(req.body.password, user.password)
                        .then((match) => {
                            if (match) {

                                jwt.sign(user, conf.jwtSecret, function (err, token) {

                                    if (err) {
                                        res.status(500).send(err)
                                    } else {
                                        res.send({
                                            token: token
                                        })
                                    }

                                })

                            } else {
                                res.status(400).send(messages.incorrectPassword)
                            }
                        })
                        .catch((err) => {
                            res.status(500).send(messages.internalError)
                        })

                } else {
                    res.status(400).send(messages.userNotFound)
                }

            })
            .catch((err) => {
                res.status(500).send(messages.internalError)
            })

    }

}