const bcrypt = require('bcrypt');

let validPassword = function validPassword(password, hash, salt){
  let hashVerify = bcrypt.hash(password, salt);
  return hash === hashVerify;
}


module.exports.validPassword = validPassword;
