const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt의 자리수를 정함
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//비밀번호를 암호화
userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPasswords, cb) {
  bcrypt.compare(plainPasswords, this.password, function (err, isMatch) {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용하여 토큰을 생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    return cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  //토큰을 디코드 한다.

  jwt.verify(token, 'secretToken', function (err, decoded) {
    //유저 ID를 이용해서 유저를 찾은 다음 클라이언트에서 가져온 토큰과 DB 보관된 토큰이 일치하는지 확인
    user.findOne(
      {
        _id: decoded,
        token: token,
      },
      function (err, user) {
        if (err) return cb(err);
        return cb(null, user);
      },
    );
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
