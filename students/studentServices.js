const db = require("../data/dbConfig");
const Students = require("./studentsModel");
const Tasks = require("../tasks/tasksModel");

module.exports = {
  validTask,
  validEditTask,
  validTaskId,
};

//checks if task has all required fields
function validTask(task) {
  return Boolean(task.name && task.due_date);
}

//checks that at least one task field is provided
function validEditTask(task) {
  return Boolean(
    task.name || task.due_date || task.description || task.completed,
  );
}

//checks that a task with the id exists
async function validTaskId(taskId) {
  return db("tasks").where({ id: taskId });
}
