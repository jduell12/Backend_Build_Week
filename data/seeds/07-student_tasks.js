exports.seed = function (knex) {
  return knex("student_tasks").insert([{ student_id: 1, task_id: 1 }]);
};
