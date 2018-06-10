const conf = require('./../core/config')
const Engine = require('./../core/engine')
const db = require('./database')
const dp = require('./../components/DataProcessing')
const Joi = require('joi')

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
                    coreData = dp.set(coreData, '/databases/' + user.username, [])

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
    delete: (username, callback) => {

        callback(username)

    }

}