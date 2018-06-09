const config = require('./../core/config')
const getValue = require("get-value");
const setValue = require("set-value");
const unsetValue = require("unset-value");

module.exports = {

    get: function (data, path) {



    },

    set: function (data, path, json) {

        return setValue(data, this.preparePath(path), json)

    },

    preparePath: function (path) {
        return path.split(config.engine.pathSeparator).filter((n) => {
            return n ? true : false
        }).join('.')
    },

}