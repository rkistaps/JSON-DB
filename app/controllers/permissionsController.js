const PermChecker = require('./../components/PermissionChecker')
const Permission = require('./../models/permission')

module.exports = {

    register: function (app) {

        // list
        app.get('/permissions', PermChecker.hasPermission('list_permissions'), function (req, res) {

            Permission.getAll(function (err, data) {

                if (err) {
                    res.status(500).send('Internal error')
                } else {
                    res.send(data)
                }

            })

        })

        // add permission
        app.post('/permissions', PermChecker.hasPermission('manage_permissions'), function (req, res) {

            Permission.create(req.body, function (err, result) {

                if (err) {
                    res.status(400).send(err)
                } else {
                    res.send(result)
                }

            })

        })

    }

}