const Students = require("../students/studentsModel");

module.exports = {
  userValid,
  loginValid,
  classValid,
  studentValid,
  editStudentValid,
  checkStudent,
};

//checks that a username and password is provided
function userValid(user) {
  return Boolean(user.username && user.password);
}

//checks that login is valid
function loginValid(user) {
  return Boolean(
    user.username && user.password && typeof user.password === "string",
  );
}

//checks that the class has all required fields
function classValid(classInfo) {
  return Boolean(classInfo.name);
}

//checks that the student has all required fields
function studentValid(studentInfo) {
  return Boolean(studentInfo.name && studentInfo.class_id);
}

//checks that the edit information has either a name for the student or a class id for the student
function editStudentValid(studentInfo) {
  return Boolean(
    studentInfo.name || (studentInfo.class_id && studentInfo.prevClassId),
  );
}

//checks that a student with the id exists
async function checkStudent(studentId) {
  return Students.getStudentById(studentId);
}
