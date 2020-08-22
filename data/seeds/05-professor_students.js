exports.seed = function (knex) {
  return knex("professor_students").insert([
    {
      id: 1,
      user_id: 1,
      student_id: 1,
    },
  ]);
};
