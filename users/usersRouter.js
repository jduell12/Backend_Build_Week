const router = require("express").Router();
const Users = require("./usersModel");
const Classes = require("../classes/classesModel");
const Students = require("../students/studentsModel");
const helpers = require("./usersService");

const db = require("../data/dbConfig");

/**
 * @api {get} /users Get student list of current user
 * @apiGroup Users
 * @apiSuccess {Array} data Student objects
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
       "data": [
        {
            "id": 1,
            "username": "morpheous",
            "password": "pass",
            "class_id": 1
        },
        {
            "id": 3,
            "username": "sammy",
            "password": "$2a$12$O1HL5IgglOwnkrLElF7rguxCIx3BeY2uDsUQJT.Vnr.9L/DMRMgBO",
            "class_id": 1
        },
        {
            "id": 4,
            "username": "merry",
            "password": "$2a$08$pC/D/yh8pICeEozfWRW2weJlp.tREqKNbGd8uoS7QJ7in4Y6ZGniy",
            "class_id": 1
        },
        {
            "id": 5,
            "username": "merryPippin",
            "password": "$2a$08$TjS.2aIuu0.eOjcxCvWhwewoPAPiJq9.IkU7hzjAtpVXoYkPvyRe6",
            "class_id": 1
        }
    ]
    }

    @apiErrorExample Error-Response:
      HTTP 500 INTERNAL SERVER ERROR
      {
        "error": "error message goes here"
      }
 */

//gets list of students of current user
router.get("/", async (req, res) => {
  let userNum = "";
  await Users.getUserByUsername(req.jwt.username).then((user) => {
    return (userNum = user.id);
  });

  Users.getStudents(userNum)
    .then((students) => {
      res.status(200).json({ data: students });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @api {post} /users/classes Add a class that the user is teaching
 * @apiGroup Users
 * @apiParam name string
 * @apiSuccess {String} message 
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 201 Created
    {
      "message": "Success"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Please enter all required fields to add the class."
      }
 */

//adds class to user's class list
router.post("/classes", async (req, res) => {
  if (req.body) {
    if (helpers.classValid(req.body)) {
      let classId = "";

      await Classes.addClass(req.body).then((id) => {
        classId = id;
        return classId;
      });

      let userNum = "";
      await Users.getUserByUsername(req.jwt.username).then((user) => {
        userNum = user.id;
      });

      Users.addClassUserList(userNum, classId[0])
        .then((resp) => {
          res.status(201).json({ message: "Success" });
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

/**
 * @api {post} /users/students Add a student to the user's student list
 * @apiGroup Users
 * @apiParam name string
 * @apiParam class_id integer
 * @apiSuccess {String} message
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 201 Created
    {
      "message": "Success"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Please enter all required fields to add the student."
      }
 */
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

/**
 * @api {put} /users/students/:studentId Edit a student in the user's student list
 * @apiGroup Users
 * @apiParam name string
 * @apiParam class_id integer Class id of new class
 * @apiParam prevClassId integer Class id of current class - used when changing students to a different class in conjunction with class_id
 * @apiSuccess {String} message
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 200 OK
    {
      "message": "Edited student successfully"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
         "message": "Please provide a name for the student or the current class id and previous class id"
      }
 */
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

/**
 * @api {delete} /users Deletes the user
 * @apiGroup Users
 * @apiParam userId integer taken from url
 * @apiSuccess {String} message
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 200 OK
    {
      "message": "Deleted user Successfully"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "A user with that id doesn't exist"
      }
 */
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

/**
 * @api {delete} /users/students/:studentId Delete a student in the user's student list
 * @apiGroup Users
 * @apiParam studentId integer taken from url
 * @apiSuccess {String} message
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 200 OK
    {
      "message": "Deleted student Successfully"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "A student with that id doesn't exist"
      }
 */
//deletes a student in the user's student list
router.delete("/students/:id", async (req, res) => {
  const check = await helpers.checkStudent(req.params.id);
  if (check) {
    Students.deleteStudent(req.params.id)
      .then((count) => {
        res.status(200).json({ message: "Deleted student Successfully" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(406).json({
      message: "A student with that id doesn't exist",
    });
  }
});

module.exports = router;
