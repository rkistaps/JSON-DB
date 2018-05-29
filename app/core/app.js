const config = require("./config");
const engine = require('./engine')

module.exports = {
  // init db service
  init: function(callback) {
    
    engine.init(function () {
        callback()
    })

  },

  // start db service
  run: function() {
    const express = require("express")
    var express_app = express()

    express_app.listen(config.port, function() {
      console.log(config.name + " app started on port " + config.port)
    });
  }
};
