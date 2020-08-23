exports.seed = function (knex) {
  return knex("student_classes").insert([{ student_id: 1, class_id: 1 }]);
};
