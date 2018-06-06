const config = require("./config");
const fs = require("fs");
const getValue = require("get-value");
const setValue = require("set-value");
const unsetValue = require("unset-value");

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