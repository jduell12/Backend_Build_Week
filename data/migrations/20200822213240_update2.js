exports.up = function (knex) {
  return knex.schema.createTable("student_tasks", (tbl) => {
    tbl.increments("id");
    tbl
      .integer("student_id")
      .unsigned()
      .references("students.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("task_id")
      .unsigned()
      .references("tasks.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("student_tasks");
};
