const conf = require('./../core/config')
const Engine = require('./../core/engine')
const db = require('./database')
const dp = require('./../components/DataProcessing')
const Joi = require('joi')
const fs = require('fs-extra')

module.exports = {

    path: '/users',

    schema: {
        username: Joi.string().min(3).required(),
        password: Joi.string().min(3).required(),
    },

    get: function (username) {
        return new Promise((resolve, reject) => {

            db.getCoreData(this.path + '/' + username)
                .then((user) => {
                    resolve(user)
                })
                .catch((err) => {
                    reject(err)
                })

        })
    },

    getAll: function () {
        return new Promise((resolve, reject) => {

            db.getCoreData(this.path)
                .then((users) => {
                    resolve(users)
                })
                .catch((err) => {
                    reject(err)
                })

        })
    },

    validate: function (user) {

        const result = Joi.validate(user, this.schema)

        if (result.error) {
            return result.error
        } else {
            return true;
        }

    },

    create: function (user) {

        return new Promise((resolve, reject) => {

            db.getCoreData()
                .then((coreData) => {

                    // add to users 
                    coreData = dp.set(coreData, this.path + '/' + user.username, user)

                    // add to databases
                    coreData = dp.set(coreData, db.path + '/' + user.username, [])

                    db.saveCoreData(coreData)
                        .then(() => {
                            resolve(user)
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

    // implement me
    delete: function (username) {

        return new Promise((resolve, reject) => {

            // delete all databases
            db.getByUser(username)
                .then((databases) => {

                    db.batchDelete(username, databases)
                        .then(() => {

                            // delete db dir itself
                            fs.remove(db.getDirPath(username))
                                .then(() => {

                                    // update core db
                                    db.getCoreData()
                                        .then((coreData) => {

                                            // remove from users 
                                            // coreData = dp.unset(coreData, this.path + '/' + username)

                                            // remove from databases
                                            console.log(db.path + '/' + username)


                                            console.log(coreData.databases);

                                            coreData = dp.unset(coreData, db.path + '/' + username)

                                            console.log(coreData.databases);

                                            db.saveCoreData(coreData)
                                                .then(() => {
                                                    resolve()
                                                })
                                                .catch((err) => {
                                                    reject(err)
                                                })

                                        })
                                        .catch((err) => {
                                            reject(err)
                                        })

                                })

                        })
                        .catch((err) => {
                            reject(err)
                        })

                })
                .catch((err) => {
                    reject(err)
                })


            // remove user from core db




        })

        callback(username)

    }

}