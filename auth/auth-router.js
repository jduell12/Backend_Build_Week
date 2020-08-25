const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/usersModel");
const { userValid, loginValid } = require("../users/usersService");
const constants = require("../config/constants");
const helpers = require("./helpers");
const { signToken } = require("./helpers");

/**
  @api {post} /auth/register Add a new user
  @apiGroup Auth
  @apiName Register
  @apiParam username string
  @apiParam password string

  @apiSuccess 201 Jason web token 

  @apiSuccessExample Success-Response: 
    HTTP/1.1 201 ok
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lcnJ5IiwiaWF0IjoxNTk4MzkxNDc5LCJleHAiOjE1OTgzOTUwNzl9.N2fRATukOGX1lmiC9nlUZUegWnQ5ro0cuBWSpURbg_c"
    }

    @apiErrorExample Error-Response:
      HTTP/1.1 406 BAD REQUEST
      {
        "message": "Please provide a username and password"
      }
*/
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
      .then((returnedUser) => {
        const token = signToken(user);
        res.status(201).json({ token });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(400).json({ message: "Please provide a username and password" });
  }
});

/**
  @api {post} /auth/login Login a user
  @apiGroup Auth
  @apiName Login
  @apiParam username string
  @apiParam password string

  @apiSuccess 201 Jason web token 

  @apiSuccessExample Success-Response: 
    HTTP/1.1 201 ok
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lcnJ5IiwiaWF0IjoxNTk4MzkxNDc5LCJleHAiOjE1OTgzOTUwNzl9.N2fRATukOGX1lmiC9nlUZUegWnQ5ro0cuBWSpURbg_c"
    }

    @apiErrorExample Error-Response:
      HTTP/1.1 406 BAD REQUEST
      {
        "message": "Please provide a username and password"
      }
*/
router.post("/login", (req, res) => {
  if (loginValid(req.body)) {
    const { username, password } = req.body;

    Users.getUserByUsername(username)
      .then((user) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = signToken(user);
          res.status(200).json({ message: "Welcome", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(400).json({ message: "Please provide a username and password" });
  }
});

module.exports = router;
