const Classes = require("./classesModel");

module.exports = {
  validClass,
  checkClass,
};

//checks that all required fields for a class are provdied
function validClass(classInfo) {
  return Boolean(classInfo.name);
}

//checks that a class with the id exists
function checkClass(classId) {
  return Classes.getClassById(classId);
}
