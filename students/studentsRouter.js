const router = require("express").Router();
const Students = require("./studentsModel");
const helpers = require("./studentServices");

router.get("/:id/tasks", (req, res) => {
  Students.getTasks(req.params.id)
    .then((classes) => {
      res.status(200).json({ data: classes });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

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

module.exports = router;
