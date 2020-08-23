exports.up = function (knex) {
  return knex.schema.createTable("student_classes", (tbl) => {
    tbl.increments("id");
    tbl
      .integer("student_id")
      .unsigned()
      .references("students.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    tbl
      .integer("class_id")
      .unsigned()
      .references("classes.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("student_classes");
};
