const router = require("express").Router();
const Classes = require("./classesModel");
const Users = require("../users/usersModel");

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

module.exports = router;
