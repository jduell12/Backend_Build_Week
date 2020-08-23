const db = require("../data/dbConfig");

module.exports = {
  getClasses,
  addClass,
  editClass,
  deleteClass,
};

function getClasses() {
  return db("classes");
}

async function addClass(classInfo) {
  return db("classes").insert(classInfo);
}

async function editClass(classId, classInfo) {
  return null;
}

async function deleteClass(classId) {
  return null;
}
