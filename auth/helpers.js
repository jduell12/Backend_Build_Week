const jwt = require("jsonwebtoken");
const constants = require("../config/constants");

module.exports = {
  signToken,
};

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const secret = constants.jwtSecret;

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}
