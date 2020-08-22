exports.seed = function (knex) {
  return knex("classes").insert([
    {
      id: 1,
      name: "Computer Science",
      description: "Learning to talk to computers",
    },
  ]);
};
