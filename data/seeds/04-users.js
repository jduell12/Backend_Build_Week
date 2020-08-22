exports.seed = function (knex) {
  return knex("users").insert([
    {
      id: 1,
      username: "morpheous",
      password: "pass",
      class_id: 1,
    },
  ]);
};
