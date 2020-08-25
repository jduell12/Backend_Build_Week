const router = require("express").Router();
const Classes = require("./classesModel");
const Users = require("../users/usersModel");
const helpers = require("./classesService");

/**
 * @api {get} /classes Get class list of current user
 * @apiGroup Classes
 * @apiSuccess {Array} data Class objects
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "data": [
          {
              "name": "Math",
              "id": 2
          }
        ]
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Please enter all required fields to add the class."
      }
 */
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

/**
 * @api {get} /classes/:classId Get student list for particular class
 * @apiGroup Classes
 * @apiSuccess {Array} data Student objects
 * @apiParam {Integer} classId Taken from url
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "data": [
          {
              "name": "Neo",
              "id": 1,
              "class": "Computer Science",
              "class_id": 1
          }
      ]
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "data": []"
      }
 */
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

/**
 * @api {put} /classes/:classId Edits the information for a class
 * @apiGroup Classes
 * @apiSuccess {String} message 
 * @apiParam {Integer} classId Taken from url
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "message": "Success"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Please provide a name for the class"
      }
 */
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

/**
 * @api {delete} /classes/:classId Deletes a class
 * @apiGroup Classes
 * @apiSuccess {String} message 
 * @apiParam {Integer} classId Taken from url
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "message": "Class deleted Successfully"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Class with that id doesn't exist"
      }
 */
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
