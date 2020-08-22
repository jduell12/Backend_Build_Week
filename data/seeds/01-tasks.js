exports.seed = function (knex) {
  return knex("tasks").insert([
    {
      id: 1,
      name: "Determine a thesis",
      description: "Pick a topic to research",
      due_date: "Sep 1, 2020",
      completed: 0,
    },
  ]);
};
