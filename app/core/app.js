const config = require("./config")
const engine = require("./engine")
const express = require("express")

module.exports = {

  // init db service
  init: function (callback) {
    engine.init(function (good, error) {
      callback(good, error)
    })
  },

  // start db service
  run: function () {

    var express_app = express()

    express_app.listen(config.port, function () {
      console.log(config.name + " app started on port " + config.port)
    })

    this.registerControllers(express_app)

  },

  registerControllers: function (app) {

    app.get('/', (req, res) => {

      res.send('Hi')

    })

  }

}