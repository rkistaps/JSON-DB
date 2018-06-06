const jwt = require('jsonwebtoken')
const functions = require('./../core/functions')
const engine = require('./../core/engine')
const user = require('./../models/user')
const conf = require('./../core/config')

module.exports = {

    login: function (req, res) {

        const body = req.body;

        if (body.username && body.password) {

            user.get(body.username, function (err, user) {

                if (err) {
                    res.status(500).send(err)
                } else {

                    if (user) {


                        functions.comparePassword(body.password, user.password, function (err, isPasswordMatch) {

                            response = ''

                            if (err) {

                                res.status(500).send(err)

                            } else if (isPasswordMatch) {

                                response = user
                                jwt.sign({
                                    user: user
                                }, conf.jwtSecret, function (err, token) {

                                    if (err) {
                                        res.status(500).send(err)
                                    } else {
                                        res.send({
                                            token: token
                                        })
                                    }

                                })

                            } else {
                                res.status(400).send("Wrong password")
                            }

                        })

                    } else {
                        res.status(404).send('user not found')
                    }

                }

            })

        } else {
            res.status(400).send("Username and password is mandatory")
        }


    }

}