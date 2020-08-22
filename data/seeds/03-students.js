exports.seed = function (knex) {
  return knex("students").insert([
    {
      id: 1,
      name: "Neo",
      task_id: 1,
      class_id: 1,
    },
  ]);
};
