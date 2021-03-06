const bcrypt = require("bcrypt");

module.exports = {
  cryptPassword: function (password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return callback(err);

      bcrypt.hash(password, salt, function (err, hash) {
        return callback(err, hash);
      });
    });
  },

  comparePassword: function (plainPass, hashword, callback) {
    bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
      return err == null ? callback(null, isPasswordMatch) : callback(err);
    });
  },

  comparePasswordPromise: function (password, hash) {

    return new Promise((resolve, reject) => {

      bcrypt.compare(password, hash, function (err, isPasswordMatch) {

        if (err) {
          reject(err)
        } else {
          resolve(isPasswordMatch)
        }

      });

    })

  },


};
