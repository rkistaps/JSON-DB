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

    create: function (username, name) {

        const path = '/databases/' + username

        return new Promise((resolve, reject) => {

            // update core db
            this.getCoreData(path)
                .then((databases) => {

                    databases.push(name)
                    return this.setCoreData(path, databases)

                })
                .then((databases) => {

                    // creat db file
                    const db_file_path = this.getFilePath(username, name)
                    fs.outputJson(db_file_path, {}).then((data) => {
                        resolve(name)
                    })

                }).catch((err) => {
                    reject(err)
                })
        })

    },

    getByUser: function (user) {

        return new Promise((resolve, reject) => {

            this.getCoreData(this.path + '/' + user)
                .then((databases) => {
                    resolve(databases)
                })
                .catch((err) => {
                    reject(err)
                })

        })

    },

    hasDatabase: function (user, database) {

        return new Promise((resolve, reject) => {

            this.getByUser(user)
                .then((databases) => {
                    resolve(databases.indexOf(database) !== -1)
                })

        })

    },

    set: function (username, database, path, data, callback) {

        Engine.setByPath(username, database, path, data, callback)

    }, set: function (username, database, path, data, callback) {

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

        })

    },

    saveDbData: function (username, database, data) {

        const filename = this.getFilePath(username, database)

        return this.saveData(filename, data)

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

    getCoreData: function (path) {

        return this.getData(conf.engine.coreUser, conf.engine.coreDbName, path)

    },

    getData: function (username, database, path) {

        return new Promise((resolve, reject) => {

            const filepath = this.getFilePath(username, database)

            fs.readJson(filepath)
                .then((data) => {

                    resolve(dp.get(data, path))

                })
                .catch((err) => {
                    reject(err)
                })

        })

    },

    setCoreData: function (path, data) {

        return this.setData(conf.engine.coreUser, conf.engine.coreDbName, path, data)

    },

    setData: function (username, database, path, data) {

        return new Promise((resolve, reject) => {

            this.getData(username, database, '/')
                .then((dbdata) => {

                    dbdata = dp.set(dbdata, path, data)
                    this.saveDbData(username, database, dbdata)

                    resolve(data)

                }).catch((err) => {
                    reject(err)
                })

        })

    },

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