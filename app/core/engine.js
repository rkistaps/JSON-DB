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