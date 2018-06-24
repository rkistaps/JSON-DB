const jwt = require('jsonwebtoken')
const conf = require('./../core/config')

module.exports = {

    setRequestUser: () => {
        return (req, res, next) => {

            // get token from request
            const bearer_token = req.headers['authorization']

            if (typeof bearer_token !== 'undefined') {

                // get token
                // Authorization: bearer <TOKEN>
                const token = bearer_token.split(' ')[1]

                jwt.verify(token, conf.jwtSecret, function (err, authData) {

                    if (!err) { // auth is good

                        // setting auth data
                        req.user = authData

                    }

                })

            }

            next() // next middleware

        }
    },

    isAuthorized: () => {

        return (req, res, next) => {

            if (req.user) {

                next()

            } else {
                res.status(403).send("authorization required")
            }


        }
    },

    hasPermission: function (permission) {

        return function (req, res, next) {

            req.user.permissions = typeof req.user.permissions !== 'undefined' ? req.user.permissions : []
            if (req.user && (req.user.permissions.indexOf(permission) !== -1 || req.user.permissions.indexOf('root') !== -1)) {

                next()

            } else {

                res.status(403).send("'" + permission + "' permission is required")

            }

        }

    }

}