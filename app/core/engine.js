const config = require("./config");
const fs = require("fs");
const getValue = require("get-value");
const setValue = require("set-value");
const unsetValue = require("unset-value");
const mkdirp = require('mkdirp')

module.exports = {

    error: {},

    init: function (callback) {

        const self = this

        callback(true)

    },

    queryData: function (data, path, callback) {

        path = this.preparePath(path)

        if (path == '') {
            result = data
        } else {
            result = getValue(data, path)
        }

        callback(result);

    },

    queryCoreDb: function (path, callback) {

        this.queryDbData(config.engine.coreUser, config.engine.coreDbName, path, callback)

    },

    queryDbData: function (username, database, path, callback) {

        const self = this

        this.getDbData(username, database, function (err, data) {

            if (!err) {

                self.queryData(data, path, function (result) {
                    callback(false, result)
                })

            } else {
                callback(err)
            }

        })

    },

    addUser: function (user, callback) {

        const self = this

        this.queryCoreDb('/', function (err, result) {

            result['users'][user.username] = user
            result['databases'][user.username] = []

            self.setCoreDbData(result, function (stored) {

                callback(stored)

            })

        })

    },

    addDatabase: function (username, database, callback) {

        this.getCoreDbData((err, data) => {

            if (data) {

                const user_dbs = getValue(data, this.preparePath('/databases/' + username))
                user_dbs.push(database)

                // writting to user_dbs
                setValue(data, this.preparePath('/databases/' + username), user_dbs)

                this.setCoreDbData(data, () => {

                    // user db dir
                    var dir = config.engine.dataDir + '/' + username

                    // create db file
                    mkdirp(dir, (err) => {

                        fs.writeFile(dir + '/' + database + '.json', '{}', function (err) {

                            callback(true)

                        });

                    })

                })

            }

        })

    },

    setCoreDbData(data, callback) {
        this.setDbData(config.engine.coreUser, config.engine.coreDbName, data, callback)
    },


    setDbData: function (username, database, data, callback) {

        const path = this.getDBFilePath(username, database)
        fs.writeFile(path, JSON.stringify(data), 'utf8', function () {


            if (typeof callback == 'function') {
                callback(true);
            }

        });

    },

    setCoreByPath: function (path, data, callback) {

        this.setByPath(config.engine.coreUser, config.engine.coreDbName, path, data, callback)

    },

    setByPath(username, database, path, data, callback) {
        const self = this
        this.getDbData(username, database, function (err, dbdata) {

            if (err) {
                callback(err)
            } else {

                setValue(dbdata, self.preparePath(path), data)
                self.setDbData(username, database, dbdata, function (result) {
                    callback(result)
                })

            }

        })

    },

    getCoreDbData: function (callback) {

        this.getDbData(config.engine.coreUser, config.engine.coreDbName, callback)

    },

    getDbData: function (username, database, callback) {

        const path = this.getDBFilePath(username, database)

        fs.exists(path, function (exist) {

            if (exist) {
                fs.readFile(path, (err, data) => {
                    if (err) throw err;

                    data = JSON.parse(data);
                    data = data ? data : {};

                    callback(false, data);

                });
            } else {
                callback('DB do not exist');
            }

        })


    },

    getDBFilePath: function (username, name) {
        return config.engine.dataDir + '/' + username + '/' + this.processDBName(name)
    },

    processDBName: function (name) {
        return name + '.json'
    },

    // changing to dot notation
    preparePath: function (path) {
        return path.split(config.engine.pathSeparator).filter((n) => {
            return n ? true : false
        }).join('.')
    },

};