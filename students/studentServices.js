module.exports = {
  validTask,
  validEditTask,
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
