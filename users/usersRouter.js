const router = require("express").Router();
const Users = require("./usersModel");
const Classes = require("../classes/classesModel");
const Students = require("../students/studentsModel");
const helpers = require("./usersService");

//gets list of students of current user
router.get("/", (req, res) => {
  Users.getStudents()
    .then((students) => {
      res.status(200).json({ data: students });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

//adds class to user's class list
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

//adds student to user's student list
router.post("/students", async (req, res) => {
  if (req.body) {
    if (helpers.studentValid(req.body)) {
      let studentId = "";

      await Students.addStudent(req.body).then((id) => {
        studentId = id;
        return studentId[0];
      });

      let userNum = "";
      await Users.getUserByUsername(req.jwt.username).then((user) => {
        userNum = user.id;
      });

      Users.addStudentUserList(userNum, studentId)
        .then((resp) => {
          res.status(201).json({ message: "Success" });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.status(406).json({
        message: "Please enter all required fields to add the student.",
      });
    }
  } else {
    res.status(406).json({ message: "Need to submit student information" });
  }
});

//edits a student in the user's student list
router.put("/students/:id", (req, res) => {
  if (helpers.editStudentValid(req.body)) {
    Students.editStudent(req.params.id, req.body)
      .then((count) => {
        res.status(200).json({ message: "Edited student successfully" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(406).json({
      message:
        "Please provide a name for the student or the current class id and previous class id",
    });
  }
});

//deletes a user from db
router.delete("/", async (req, res) => {
  let userNum = "";
  await Users.getUserByUsername(req.jwt.username).then((user) => {
    userNum = user.id;
  });

  if (userNum != null || userNum != undefined) {
    Users.deleteUser(userNum)
      .then((count) => {
        res.status(200).json({ message: "User deleted Successfully" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res
      .status(406)
      .json({ message: "No user with that username or id exists" });
  }
});

module.exports = router;
