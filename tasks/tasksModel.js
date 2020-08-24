const db = require("../data/dbConfig");

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
  return db("tasks").where({ id: taskId }).update(task);
}

async function deleteTask(taskId) {
  return db("tasks").where({ id: taskId }).del();
}
