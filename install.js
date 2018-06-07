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

                    // initial core db
                    const core_db = {
                        "users": {},
                        "databases": {},
                        "permissions": {},
                    }

                    core_db.users[coreUser] = {
                        username: coreUser,
                        password: hash,
                        permissions: ['root']
                    }

                    core_db.databases[coreUser] = [coreDbName]

                    core_db.permissions = ['root', 'create_user', 'create_database']

                    fs.write(fd, JSON.stringify(core_db), function () {

                    });
                })

            }

        });

    }

})