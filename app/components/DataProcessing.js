const config = require('./../core/config')
const getValue = require("get-value");
const setValue = require("set-value");
const unsetValue = require('./UnsetValue')

var isObject = require('isobject');
var has = require('has-value');

module.exports = {

    options: {
        separator: config.engine.pathSeparator
    },

    get: function (data, path) {

        path = path ? path : '/'
        path = this.preparePath(path)

        if (path) {
            return getValue(data, path)
        } else {
            return getValue(data)
        }

    },

    set: function (data, path, json) {

        return setValue(data, this.preparePath(path), json)

    },

    unset: function (data, path) {

        unsetValue(data, this.preparePath(path))
        return data

    },

    preparePath: function (path) {

        return path.split(config.engine.pathSeparator).filter((n) => {
            return n ? true : false
        }).join('.')

    }

}