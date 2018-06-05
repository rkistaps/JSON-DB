const jwt = require('jsonwebtoken')
const functions = require('./../core/functions')
const engine = require('./../core/engine')
const user = require('./../models/user')

module.exports = {

    login: function (req, res) {

        const body = req.body;

        if (body.username && body.password) {

            user.get(body.username, function (err, user) {

                if (err) {
                    res.status(500).send(err)
                } else {

                    if (user) {
                        res.send(user)
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