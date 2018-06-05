const conf = require('./../core/config')
const engine = require('./../core/engine')

module.exports = {

    get: function (username, callback) {

        engine.queryCoreDb('/users/' + username, function (err, data) {

            callback(err, data)

        })

    }

}