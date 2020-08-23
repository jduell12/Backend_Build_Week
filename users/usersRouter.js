const router = require("express").Router();
const Users = require("./usersModel");
const Classes = require("../classes/classesModel");
const helpers = require("./usersService");

router.get("/", (req, res) => {
  Users.getStudents()
    .then((students) => {
      res.status(200).json({ data: students });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/classes", async (req, res) => {
  if (req.body) {
    if (helpers.classValid(req.body)) {
      let classId = "";

      await Classes.addClass(req.body).then((id) => {
        classId = id;
        return classId[0];
      });

      let userNum = "";
      await Users.getUserByUsername(req.jwt.username).then((user) => {
        userNum = user.id;
      });

      Users.addClassUserList(userNum, classId[0])
        .then((resp) => {
          res.status(201).json({ data: "Success" });
        })
        .catch((err) => {
          res.status(500).json({
            error: err.message,
            data: { userNum, classId: classId[0] },
          });
        });
    } else {
      res.status(406).json({
        message: "Please enter all required fields to add the class.",
      });
    }
  } else {
    res.status(406).json({ message: "Need to submit class information" });
  }
});

module.exports = router;
