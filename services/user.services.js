const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const otpGenerator = require('otp-generator');
const crypto = require("crypto");
const key = "verysecretkey";

async function login({ username, password }, callback) {
    const user = await User.findOne({ username });

    if (user != null) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = auth.generateAccessToken(username);
            return callback(null, { ...user.toJSON(), token });

        } else {
            return callback({
                message: "Invalid username/Password"
            })
        }
    } else {
        return callback({
            message: "Invalid username/Password"
        })
    }

}



async function register(params, callback) {
    if (params.username === undefined) {
        return callback(
            {
                message: "Username Required"
            },
            ""
        );
    }

    const user = new User(params);
    user.save().then((response) => {
        return callback(null, response)
    }).catch((error) => {
        return callback(error);
    })
}



async function createOTP(params, callback) {
    const otp = otpGenerator.generate(4, {
        digits:true,
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets:false


    });
   //5 Minutes in miliseconds
    const ttl = 5 * 60 * 1000; 
     //timestamp to 5 minutes in the future
     const expires = Date.now() + ttl;
     
     // phone.otp.expiry_timestamp
  const data = `${params.phone}.${otp}.${expires}`; 

  // creating SHA256 hash of the data
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex"); 
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
  //sendSMS(phone, `Your OTP is ${otp}. it will expire in 5 minutes`);

  console.log(`Your OTP is ${otp}. it will expire in 5 minutes`);

  var otpMessage = `Dear Customer, ${otp} is the One Time Password ( OTP ) for your login.`;

//   msg91.send(`+91${params.phone}`, otpMessage, function (err, response) {
//     console.log(response);
//   });

  return callback(null, fullHash);

}


async function verifyOTP(params, callback) {
    // Separate Hash value and expires from the hash returned from the user
    let [hashValue, expires] = params.hash.split('.');
    // Check if expiry time has passed
    let now = Date.now();
    if (now > parseInt(expires)) return callback("OTP Expired");
    // Calculate new hash with the same key and the same algorithm
    let data = `${params.phone}.${params.otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256",  key).update(data).digest("hex");
    // Match the hashes
    if (newCalculatedHash === hashValue) {
      return callback(null, "Success");
    }
    return callback("Invalid OTP");
  }

module.exports = {
    login, register, createOTP, verifyOTP,
}
