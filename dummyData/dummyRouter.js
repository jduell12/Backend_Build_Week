const router = require("express").Router();
const db = require("../data/dbConfig");

router.get("/users", async (req, res) => {
  const students = [{ name: "Neo" }, { name: "Trinity" }, { name: "Smith" }];
  const dbStudents = await db("users");
  res.status(200).json({ data: dbStudents });
});

router.get("/classes", (req, res) => {
  const classes = [
    { id: 1, name: "CS" },
    { id: 2, name: "Psy" },
    { id: 3, name: "Math" },
    { id: 4, name: "Science" },
  ];
  res.status(200).json({ data: classes });
});

router.get("/classes/1", (req, res) => {
  const students = [
    { id: 1, name: "Neo" },
    { id: 2, name: "Trinity" },
    { id: 3, name: "Smith" },
  ];
  res.status(200).json({ data: students });
});

router.get("/students/1/tasks", (req, res) => {
  const tasks = [
    {
      id: 1,
      name: "Determine a thesis",
      description: "Pick a topic to research",
      due_date: "Sep 1, 2020",
      completed: 0,
    },
  ];

  res.status(200).json({ data: tasks });
});

router.post("/users/classes", (req, res) => {
  res.status(201).json({ message: "Success" });
});

router.post("/users/students", (req, res) => {
  res.status(201).json({ message: "Success" });
});

router.post("/students/1/tasks", (req, res) => {
  res.status(201).json({ message: "Success" });
});

router.put("/classes/1", (req, res) => {
  res.status(200).json({ message: "Success" });
});

router.put("/users/students/1", (req, res) => {
  res.status(200).json({ message: "Success" });
});

router.put("/students/1/tasks/1", (req, res) => {
  res.status(200).json({ message: "Success" });
});

router.delete("/users", (req, res) => {
  res.status(200).json({ message: "Success" });
});

router.delete("/classes/1", (req, res) => {
  res.status(200).json({ message: "Success" });
});

router.delete("/users/students/1", (req, res) => {
  res.status(200).json({ message: "Success" });
});

router.delete("/students/1/tasks/1", (req, res) => {
  res.status(200).json({ message: "Success" });
});

module.exports = router;
