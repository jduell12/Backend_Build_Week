const router = require("express").Router();
const Classes = require("./classesModel");
const Users = require("../users/usersModel");
const helpers = require("./classesService");

//gets list of classes for a user that's logged in
router.get("/", async (req, res) => {
  let userNum = "";
  await Users.getUserByUsername(req.jwt.username).then((user) => {
    userNum = user.id;
  });

  Users.getClasses(userNum)
    .then((classes) => {
      console.log(classes);
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

//edits the class information for a particular class
router.put("/:id", (req, res) => {
  if (helpers.validClass(req.body)) {
    Classes.editClass(req.params.id, req.body)
      .then((count) => {
        res.status(200).json({ message: "Success" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(406).json({ message: "Please provide a name for the class" });
  }
});

//deletes a class with the particular id
router.delete("/:id", async (req, res) => {
  const check = await helpers.checkClass(req.params.id);
  if (check) {
    Classes.deleteClass(req.params.id)
      .then((count) => {
        res.status(200).json({ message: "Class deleted Successfully" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(406).json({ message: "Class with that id doesn't exist" });
  }
});

module.exports = router;
