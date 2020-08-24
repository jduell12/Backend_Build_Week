const router = require("express").Router();
const Students = require("./studentsModel");
const helpers = require("./studentServices");

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

//edits a task of the student
router.put("/:id/tasks/:tid", async (req, res) => {
  if (helpers.validEditTask(req.body)) {
    const check = await helpers.inTaskList(req.params.id, req.params.tid);
    if (check) {
      const { name, description, due_date, completed } = req.body;
      const editTask = { name, description, due_date, completed };
      Students.editTask(req.params.id, req.params.tid, editTask)
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

//deletes a task of the student
router.delete("/:id/tasks/:tid", async (req, res) => {
  const check = await helpers.validTaskId(req.params.tid);

  if (check) {
    const check2 = await helpers.inTaskList(req.params.id);

    if (check2) {
      Students.deleteTask(req.params.id, req.params.tid)
        .then((count) => {
          res.status(200).json({ message: "Deleted task Successfully" });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.status(406).json({ message: "That student doesn't have that task" });
    }
  } else {
    res.status(406).json({ message: "That task does not exist" });
  }
});

module.exports = router;
