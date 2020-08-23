const router = require("express").Router();
const Classes = require("./classesModel");
const Users = require("../users/usersModel");

//gets list of classes for a user that's logged in
router.get("/", async (req, res) => {
  let userNum = "";
  await Users.getUserByUsername(req.jwt.username).then((user) => {
    userNum = user.id;
  });

  Users.getClasses(userNum)
    .then((classes) => {
      res.status(200).json({ data: classes });
    })
    .catch((err) => {
      res.status(401).json({ error: err.message });
    });
});

//gets the student list for a particular class
router.get("/:id", (req, res) => {
  Classes.getStudents(req.params.id)
    .then((students) => {
      res.status(200).json({ data: students });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
