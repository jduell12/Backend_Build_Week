const router = require("express").Router();
const Students = require("./studentsModel");
const helpers = require("./studentServices");

/**
 * @api {get} /students/:studentId/tasks Get task list for particular student 
 * @apiGroup Student Tasks
 * @apiSuccess {Array} data Task objects
 * @apiParam studentId integer taken from url
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
    "data": [
        {
            "id": 1,
            "name": "Determine a thesis",
            "description": "Pick a topic to research",
            "due_date": "Sep 1, 2020",
            "completed": 0
        }
    ]
}

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        data: []
      }
 */
//gets task list for the student
router.get("/:id/tasks", (req, res) => {
  Students.getTasks(req.params.id)
    .then((classes) => {
      res.status(200).json({ data: classes });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @api {post} /students/:studentId/tasks Adds a task for a particular student
 * @apiGroup Student Tasks
 * @apiSuccess {String} message
 * @apiParam studentId integer taken from url
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "message": "Added a task"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Please supply all required fields to add a task"
      }
 */
//adds a task to the task list for the student
router.post("/:id/tasks", (req, res) => {
  if (helpers.validTask(req.body)) {
    Students.addTasks(req.params.id, req.body)
      .then(([id]) => {
        res.status(201).json({ message: "Added a task" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res
      .status(406)
      .json({ message: "Please supply all required fields to add a task" });
  }
});

/**
 * @api {put} /students/:studentId/tasks/:taskId Edits a particular task for a particular student
 * @apiGroup Student Tasks
 * @apiParam studentId integer taken from url
 * @apiParam taskId integer taken from url
 * @apiSuccess {String} message
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "message": "Edited task successfully"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "Please provide information for the task"
      }
 */
//edits a task of the student
router.put("/:id/tasks/:tid", async (req, res) => {
  if (helpers.validEditTask(req.body)) {
    const check = await helpers.validTaskId(req.params.tid);
    if (check.length !== 0) {
      const { name, description, due_date, completed } = req.body;
      const editTask = { name, description, due_date, completed };
      Students.editTask(req.params.tid, editTask)
        .then((count) => {
          res.status(200).json({ message: "Edited task successfully" });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.status(406).json({ message: "That student doesn't have that task" });
    }
  } else {
    res
      .status(406)
      .json({ message: "Please provide information for the task" });
  }
});

/**
 * @api {delete} /students/:studentId/tasks/:taskId Deletes a particular task for a particular student
 * @apiGroup Student Tasks
 * @apiParam studentId integer taken from url
 * @apiParam taskId integer taken from url
 * @apiSuccess {String} message
 * 
 * @apiSuccessExample Success-Response: 
    HTTP 200 ok
    {
      "message": "Deleted task Successfully"
    }

    @apiErrorExample Error-Response:
      HTTP 406 Not Acceptable
      {
        "message": "That task doesn't belong to that student"
      }
 */
//deletes a task of the student
router.delete("/:id/tasks/:tid", async (req, res) => {
  const check = await helpers.validTaskId(req.params.tid);

  if (check.length !== 0) {
    let tasks = await Students.getTasksIds(req.params.id)
      .then((tasks) => {
        return tasks;
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

    let check2 = tasks.filter((task) => task.id === parseInt(req.params.tid));

    if (check2.length !== 0) {
      Students.deleteTask(req.params.tid)
        .then((count) => {
          res.status(200).json({ message: "Deleted task Successfully" });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res
        .status(406)
        .json({ message: "That task doesn't belong to that student" });
    }
  } else {
    res.status(406).json({ message: "That task does not exist" });
  }
});

module.exports = router;
