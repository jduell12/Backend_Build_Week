const router = require("express").Router();
const Users = require("./usersModel");

router.get("/", (req, res) => {
  Users.getStudents().then((students) => {});
});

module.exports = router;
