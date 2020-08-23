const router = require("express").Router();
const Students = require("./studentsModel");

router.get("/:id/tasks", (req, res) => {
  Students.getTasks(req.params.id)
    .then((classes) => {
      res.status(200).json({ data: classes });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
