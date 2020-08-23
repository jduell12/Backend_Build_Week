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

async function editStudent(studentId, student) {
  return db("students")
    .where({ id: studentId })
    .update(student)
    .then((count) => {
      return count;
    });
}

async function deleteStudent(studentId) {
  return db("students").where({ id: studentId }).del();
}
