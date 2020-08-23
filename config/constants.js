require("dotenv").config();
module.exports = {
  jwtSecret: process.env.JWT_SECRET || "very super secret to keep super safe",
};
