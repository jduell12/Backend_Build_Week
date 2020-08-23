exports.up = function (knex) {
  return knex.schema.createTable("users_classes", (tbl) => {
    tbl.increments("id");
    tbl
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("class_id")
      .unsigned()
      .references("classes.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users_classes");
};
