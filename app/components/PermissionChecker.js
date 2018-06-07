const jwt = require('jsonwebtoken')
const conf = require('./../core/config')

module.exports = {

    check: function (permission, user, callback) {

        callback(true)

    },

    hasPermission: function (permission) {

        return function (req, res, next) {

            // get token from request
            const bearer_token = req.headers['authorization']

            if (typeof bearer_token !== 'undefined') {

                // get token
                // Authorization: bearer <TOKEN>
                const token = bearer_token.split(' ')[1]

                jwt.verify(token, conf.jwtSecret, function (err, authData) {

                    if (err) {

                        res.status(403).send('Authorization required')

                    } else {

                        console.log(authData)

                        if (authData.permissions.indexOf(permission) !== -1 || authData.permissions.indexOf('root') !== -1) {

                            next() // next middleware

                        } else {

                            res.status(403).send("'" + permission + "' permission is required")

                        }

                    }

                })


                // validate token

            } else {
                res.status(403).send('Authorization required')
            }


        }

    }

}