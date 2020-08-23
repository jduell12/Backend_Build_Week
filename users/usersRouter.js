const router = require("express").Router();
const Users = require("./usersModel");

router.get("/", (req, res) => {
  Users.getStudents()
    .then((students) => {
      res.status(200).json({ data: students });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
