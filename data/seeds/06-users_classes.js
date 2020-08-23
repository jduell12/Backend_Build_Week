exports.seed = function (knex) {
  return knex("users_classes").insert([{ class_id: 1, user_id: 1 }]);
};
