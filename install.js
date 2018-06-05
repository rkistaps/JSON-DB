const fs = require('fs')
const conf = require('./app/core/config')
const functions = require('./app/core/functions')

const coreUser = conf.engine.coreUser;
const coreDbName = conf.engine.coreDbName;
const corePath = conf.engine.dataDir + '/' + coreUser;


fs.mkdir(corePath, function (err) {

    if (!err) {

        fs.open(corePath + '/' + coreDbName + '.json', 'wx', (err, fd) => {

            if (!err) {

                functions.cryptPassword(coreUser, function (err, hash) { // initial password same as user
                    fs.write(fd, '{"users": { "' + coreUser + '": {"username": "' + coreUser + '", "password": "' + hash + '" } }, "databases": { "' + coreUser + '": ["' + coreDbName + '"] } }', function () {

                    });
                })

            }

        });

    }

})