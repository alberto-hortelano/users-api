var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  gender: String,
  name: Schema.Types.Mixed,
  location: Schema.Types.Mixed,
  email: String,
  username: {
    type: String,
    required: true,
    select: false
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  salt: {
    type: String
  },
  md5: {
    type: String
  },
  sha1: {
    type: String
  },
  sha256: {
    type: String
  },
  registered: Number,
  dob: Number,
  phone: String,
  cell: String,
  PPS: String,
  picture: Schema.Types.Mixed
});
/**
 * Pre save hoock
 * Generate automatic fields before saving the user.
 * TODO: It should only do this if it's a new user.
 */
UserSchema.pre('save', function(next) {
  var user = this;
  user.salt = crypto.randomBytes(6).toString('base64');
  var password_salt = user.password.toString('base64') + user.salt;
  user.md5 = crypto.createHash('md5').update(password_salt).digest('hex');
  user.sha1 = crypto.createHash('sha1').update(password_salt).digest('hex');
  user.sha256 = crypto.createHash('sha256').update(password_salt).digest('hex');
  next();
});
var User = mongoose.model('User', UserSchema);

module.exports = User;
