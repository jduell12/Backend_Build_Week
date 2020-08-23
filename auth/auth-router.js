const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/usersModel");
const { userValid, loginValid } = require("../users/usersService");
const constants = require("../config/constants");
const helpers = require("./helpers");
const { signToken } = require("./helpers");

router.post("/register", (req, res) => {
  const user = req.body;

  if (userValid(user)) {
    //need to change process.env to int since it's returned as a string
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 8;

    //hash password
    const hash = bcryptjs.hashSync(user.password, rounds);
    user.password = hash;

    //add user to database
    Users.addUser(user)
      .then((user) => {
        const token = signToken(user);
        res.status(201).json({ data: user, token });
      })
      .catch((err) => {
        console.log(err);
        res.status(500), json({ error: err.message });
      });
  } else {
    res.status(400).json({ message: "Please provide a username and password" });
  }
});

module.exports = router;
