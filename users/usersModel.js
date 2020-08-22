const db = require("../data/dbConfig");

module.exports = {
  getUsers,
  addUser,
  editUser,
  deleteUser,
  getUserById,
  getUserBy,
  getStudents,
  getClasses,
};

//returns an array of all users in database
function getUsers() {
  return db("users");
}

//adds a user to the database
async function addUser(user) {
  return db("users").insert(user);
}

//updates user with given id
async function editUser(userId, user) {
  return db("users")
    .where({ id: userId })
    .update(user)
    .then((count) => {
      return count;
    });
}

//deletes user with given id
async function deleteUser(userId) {
  return null;
}

//gets a user by a given id
async function getUserById(userId) {
  return null;
}

//gets user by something other than id
async function getUserBy(filter) {
  return null;
}

//gets a list of students for a given user
async function getStudents(userId) {
  return null;
}

//gets a list of classes for a given user
async function getClasses(userId) {
  return null;
}
