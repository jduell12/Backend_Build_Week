module.exports = {
  validTask,
};

//checks if task has all required fields
function validTask(task) {
  return Boolean(task.name && task.due_date);
}
