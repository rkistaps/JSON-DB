const config = require("./config")
const engine = require("./engine")
const express = require("express")
const authController = require('./../controllers/authController')
const usersController = require('./../controllers/usersController')
const permissionsController = require('./../controllers/permissionsController')
const databasesController = require('./../controllers/databasesController')
const queryController = require('./../controllers/queryController')
const PermissionChecker = require('./../components/PermissionChecker')

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

    express_app.use(express.json())
    express_app.use((err, req, res, next) => {

      if (err) {
        res.status(err.status).send(err.type)
      } else {
        next(err)
      }
    })

    express_app.use(PermissionChecker.setRequestUser())

    express_app.listen(config.port, function () {
      console.log(config.name + " app started on port " + config.port)
    })

    this.registerControllers(express_app)

  },

  registerControllers: function (app) {

    app.get('/', (req, res) => {
      res.send('Hi')
    })

    usersController.register(app)
    permissionsController.register(app)
    databasesController.register(app)
    queryController.register(app)

    //app.post('/login', authController.login)
    app.post('/login', authController.auth)
    //app.get('/auth', authController.auth)

  }

}