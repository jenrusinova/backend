const bcrypt = require('bcrypt');

let validPassword = function validPassword(password, hash){
  // console.log('password utils line 4');
  // console.log('1st arg', password);
  // console.log('2nd arg', hash);
  // let hashVerify = await bcrypt.hash(password);
  // console.log('hashverify', hashVerify);
  // return hash === hashVerify;
  bcrypt.compare(password, hash, (err, res) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(res) //true or false
  })
}


module.exports.validPassword = validPassword;
