const db = require("../data/dbConfig");

module.exports = {
  getStudents,
  addStudent,
  editStudent,
  deleteStudent,
};

function getStudents() {
  return db("students");
}

async function addStudent(student) {
  return db("students").insert(student);
}

async function editStudent(id, student) {
  return null;
}

async function deleteStudent(id, student) {
  return null;
}
