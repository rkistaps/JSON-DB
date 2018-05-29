const config = require("./config");
const fs = require("fs");
const getValue = require("get-value");
const setValue = require("set-value");
const unsetValue = require("unset-value");
const log = require("./../components/log");

module.exports = {

    error: {},

    init: function(callback) {
        
        log.console("Initializing engine..")
        const self = this
        
        // check for core db
        fs.stat(config.engine.coreDb, function (err, stats) {

            if (err && err.code == 'ENOENT') {
                self.initialInit(function (good, error) {
                    
                    callback(good, error)

                })
            } else {
                callback(true)
            }

        })

    },

    initialInit: function (callback) {
        
        var self = this
        log.console("Starting initial init..")

        fs.open(config.engine.coreDb, 'wx', (err, fd) => {

            if (err) {
                callback(false, err);
            } else {
                fs.write(fd, '{}', function () {
                    callback(true);
                });
            }

        });

    },

    createDatabase: function (name, callback) {

        fs.open(this.getDBFileName(name), 'wx', (err, fd) => {

            if (err) {
                if (err.code === 'EEXIST') {
                    this.setError('DB already exists');
                    callback(false);
                }
            } else {
                fs.write(fd, '{}', function () {
                    callback(true);
                });
            }

        });

    }

};
