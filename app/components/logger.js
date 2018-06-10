const winston = require('winston')
const conf = require('./../core/config')
const date = require('date-and-time')
const fs = require('fs-extra')

const now = new Date();
const logDir = conf.rootDir + '/logs/' + date.format(now, 'YYYY') + '/' + date.format(now, 'MM') + '/'

fs.ensureDir(logDir)

const errorLogger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logDir + '/' + date.format(now, 'DD') + '.errors.log' })
    ]
});



module.exports.log = function (level, message) {



}

module.exports.error = function (message) {
    errorLogger.error(message)
}