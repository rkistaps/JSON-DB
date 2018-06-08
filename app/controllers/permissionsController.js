const PermChecker = require('./../components/PermissionChecker')
const Permission = require('./../models/permission')
const Joi = require('joi')

module.exports = {

    path: '/permissions',

    register: function (app) {

        // list
        app.get(this.path, PermChecker.hasPermission('list_permissions'), function (req, res) {

            Permission.getAll(function (err, data) {

                if (err) {
                    res.status(500).send('Internal error')
                } else {
                    res.send(data)
                }

            })

        })

        // add permission
        app.post(this.path, PermChecker.hasPermission('manage_permissions'), function (req, res) {

            Permission.create(req.body, function (err, result) {

                if (err) {
                    res.status(400).send(err)
                } else {
                    res.send(result)
                }

            })

        })

        app.post(this.path + '/grant', PermChecker.hasPermission('grant_permissions'), function (req, res) {

            Permission.grant(req.body, (err, result) => {

                if (err) {
                    res.status(400).send(err)
                } else {
                    res.send(result)
                }

            })

        })

    }

}