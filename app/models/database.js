const conf = require('./../core/config')
const Engine = require('./../core/engine')
const Joi = require('joi')
const fs = require('fs-extra')
const dp = require('./../components/DataProcessing')

module.exports = {

    path: '/databases',

    schema: {
        name: Joi.string().min(3).required(),
    },

    validate: function (data) {

        const result = Joi.validate(data, this.schema)

        if (result.error) {
            return result.error
        } else {
            return true;
        }

    },

    create: function (username, name, callback) {

        Engine.addDatabase(username, name, (added) => {
            callback(added)
        })

    },

    getByUser: function (user, callback) {

        Engine.queryCoreDb(this.path + '/' + user, (err, result) => {

            callback(err, result)

        })

    },

    hasDatabase: function (user, database, callback) {

        this.getByUser(user, (err, result) => {

            if (result.indexOf(database) === -1) {
                callback(false)
            } else {
                callback(true)
            }

        })

    },

    set: function (username, database, path, data, callback) {

        Engine.setByPath(username, database, path, data, callback)

    },

    get: function (username, database, path, callback) {

        Engine.queryDbData(username, database, path, callback)

    },

    delete: function (username, database) {

        var databases;

        return new Promise((resolve, reject) => {

            // update core db
            this.getCoreData()
                .then((data) => {

                    // remove from core db
                    databases = data.databases[username]

                    databases = databases.filter((val) => {
                        return val != database
                    })

                    data = dp.set(data, this.path + '/' + username, databases)

                    // saving core db
                    return this.saveData(this.getCoreFilePath(), data)

                })
                .then(() => {

                    // delete db file
                    fs.remove(this.getFilePath(username, database))
                        .then(() => {
                            resolve(databases)
                        })
                        .catch((err) => {
                            reject(err)
                        })

                })
                .catch((err) => {
                    reject(err)
                })


            // delete db file


            //reject(new Error('Failed'));

        })

    },

    saveData: function (file, data) {

        return new Promise((resolve, reject) => {

            fs.writeJSON(file, data)
                .then(() => {
                    resolve()
                })
                .catch((err) => {
                    reject(err)
                })

        })

    },

    getCoreData: function () {

        return this.getData(conf.engine.coreUser, conf.engine.coreDbName)

    },

    getData: function (username, database) {

        return new Promise((resolve, reject) => {

            const path = this.getFilePath(username, database)

            fs.readJson(path)
                .then((data) => {
                    resolve(data)
                })
                .catch((err) => {
                    reject(err)
                })

        })

    },

    // getDbData: function (username, database, callback) {

    //     const path = this.getDBFilePath(username, database)

    //     fs.exists(path, function (exist) {

    //         if (exist) {
    //             fs.readFile(path, (err, data) => {
    //                 if (err) throw err;

    //                 data = JSON.parse(data);
    //                 data = data ? data : {};

    //                 callback(false, data);

    //             });
    //         } else {
    //             callback('DB do not exist');
    //         }

    //     })


    // },

    getCoreFilePath: function () {
        return this.getFilePath(conf.engine.coreUser, conf.engine.coreDbName)
    },

    getFilePath: function (username, database) {
        return conf.engine.dataDir + '/' + username + '/' + this.getFileName(database)
    },

    getFileName: function (name) {
        return name + '.json'
    }


}