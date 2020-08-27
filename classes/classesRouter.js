const router = require("express").Router();
const Classes = require("./classesModel");
const Students = require("../students/studentsModel");
const Users = require("../users/usersModel");
const helpers = require("./classesService");
const taskHelpers = require("../students/studentServices");

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
 * @api {get} /classes/:classId/tasks Get task list for particular class
 * @apiGroup Class Tasks
 * @apiSuccess {Array} data Task objects
 * @apiParam {Integer} classId Taken from url
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "data": [
          {
             "task": 'A task to do',
             "id: 1
          }
      ]
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "data": []"
      }
 */
//gets a task list for a particular class
router.get("/:id/tasks", (req, res) => {
  Classes.getClassTasks(req.params.id)
    .then((tasks) => {
      res.status(200).json({ data: tasks });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @api {post} /classes/:classId/tasks Adds a task to a particular class
 * @apiGroup Class Tasks
 * @apiSuccess {String} message 
 * @apiParam {Integer} classId Taken from url
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      data: 
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "No class with that id exists"
      }
      @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Please provide a name and due date for the task"
      }
 */
//adds a task to a particular class
router.post("/:id/tasks", (req, res) => {
  const classId = req.params.id;
  const task = req.body;

  if (helpers.checkClass(classId)) {
    if (taskHelpers.validTask(task)) {
      Classes.addClassTasks(classId, task)
        .then((tasks) => {
          res.status(201).json({ data: tasks });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    } else {
      res
        .status(406)
        .json({ message: "Please provide a name and due date to add a task" });
    }
  } else {
    res.status(406).json({ message: "No class with that id exists" });
  }
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
 * @api {put} /classes/:classId/tasks Edits the information for a task in a particular class
 * @apiGroup Class Tasks
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
        "message": "Please provide a name and due date for the task"
      }
 */
//edits the task information for a particular task in a particular class
router.put("/tasks/:id", (req, res) => {
  const task = req.body;
  if (
    taskHelpers.validEditTask(task) &&
    taskHelpers.validTaskId(req.params.id)
  ) {
    Students.editTask(req.params.id, task)
      .then((count) => {
        res.status(200).json({ message: "Success" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res
      .status(406)
      .json({ message: "Please provide information for the task" });
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

/**
 * @api {delete} /classes/:classId/tasks/:taskId Deletes a task of a particular class
 * @apiGroup Class Tasks
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
//deletes a particular task from a particular class
router.delete("/:id/tasks/:tid", async (req, res) => {
  const classId = req.params.id;
  const taskId = parseInt(req.params.tid);

  if (helpers.checkClass(classId)) {
    if (taskHelpers.validTaskId(taskId)) {
      const taskList = await Classes.getClassTasks(classId);

      let hasTask = false;
      taskList.forEach((task) => {
        if (task.id === taskId) {
          hasTask = true;
        }
      });

      if (hasTask) {
        Students.deleteTask(taskId)
          .then((count) => {
            res.status(200).json({ message: "Deleted task Successfully" });
          })
          .catch((err) => res.status(500).json({ error: err.message }));
      } else {
        res.status(406).json({
          message: "A task with that id doesn't exist for that class",
        });
      }
    } else {
      res.status(406).json({ message: "A task with that id doesn't exist " });
    }
  } else {
    res.status(406).json({ message: "Class with that id doesn't exit" });
  }
});
module.exports = router;
