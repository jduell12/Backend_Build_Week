const db = require("../data/dbConfig");
const Tasks = require("./tasksModel.test");

module.exports = {
  getTasks,
  addTask,
  editTask,
  deleteTask,
};

function getTasks() {
  return db("tasks");
}

async function addTask(task) {
  return db("tasks").insert(task);
}

async function editTask(taskId, task) {
  return null;
}

async function deleteTask(taskId) {
  return null;
}
