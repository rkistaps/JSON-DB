const app = require("./app/core/app")

app.init(function(inited, error) {
  if (inited) {
    app.run()
  } else {
    console.log(error)
  }
});
