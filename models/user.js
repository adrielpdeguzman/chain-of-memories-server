const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,

    match: /^[\w\d_.]{4,}$/,
    maxlength: 255,
  },

  password: {
    type: String,
    required: true,

    minlength: 6,
  },

  name: {
    type: String,
    required: true,

    match: /^[\w.']{2,}(\s[\w.']{2,})+$/,
    maxlength: 255,
  },

  email: {
    type: String,
    required: true,
    unique: true,

    match: /^[_]*([a-z0-9]+(\.|_*)?)+@([a-z][a-z0-9-]+(\.|-*\.))+[a-z]{2,6}$/,
    maxlength: 255,
  },
});

userSchema.pre('validate', function (next) {
  if (this.password) {
    bcrypt.hash(this.password, null, null, (err, hash) => {
      if (err) {
        next(err);
      }

      this.password = hash;
    });
  }

  next();
});

userSchema.set('toJSON', {
  transform(doc, ret, options) {
    const obj = Object.assign({}, ret);
    delete obj.password;

    return obj;
  },
});

module.exports = mongoose.model('User', userSchema);
