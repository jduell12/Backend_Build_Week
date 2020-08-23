const jwt = require("jsonwebtoken");
const constants = require("../config/constants");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, constants.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
};
