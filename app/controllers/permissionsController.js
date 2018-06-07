const PermChecker = require('./../components/PermissionChecker')
const Permission = require('./../models/permission')

module.exports = {

    register: function (app) {

        app.get('/permissions', PermChecker.hasPermission('list_permissions'), function (req, res) {

            Permission.getAll(function (err, data) {

                if (err) {
                    res.status(500).send('Internal error')
                } else {
                    res.send(data)
                }

            })


        })

    }

}