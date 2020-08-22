exports.up = function (knex) {
  return knex.schema
    .createTable("tasks", (tbl) => {
      tbl.increments("id");
      tbl.string("name", 256).notNullable();
      tbl.text("description");
      tbl.string("due_date").notNullable();
      tbl.boolean("completed").defaultTo(0);
    })
    .createTable("classes", (tbl) => {
      tbl.increments("id");
      tbl.string("name", 256).notNullable().unique();
      tbl.text("description");
    })
    .createTable("students", (tbl) => {
      tbl.increments("id");
      tbl.string("name", 256).notNullable().unique();
      tbl
        .integer("task_id")
        .unsigned()
        .references("tasks.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("class_id")
        .unsigned()
        .references("classes.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("users", (tbl) => {
      tbl.increments("id");
      tbl.string("username", 256).notNullable().unique();
      tbl.string("password", 256).notNullable();
      tbl
        .integer("class_id")
        .unsigned()
        .references("classes.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("professor_students", (tbl) => {
      tbl.increments("id");
      tbl
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("student_id")
        .unsigned()
        .references("students.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIFExists("tasks")
    .dropTableIFExists("classes")
    .dropTableIFExists("students")
    .dropTableIFExists("users")
    .dropTableIFExists("professor_students");
};
