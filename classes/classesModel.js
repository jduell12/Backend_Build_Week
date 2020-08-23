const db = require("../data/dbConfig");

module.exports = {
  getClasses,
  addClass,
  editClass,
  deleteClass,
  getStudents,
};

//returns an array of all classes in database
function getClasses() {
  return db("classes");
}

//adds a class to the database
async function addClass(classInfo) {
  return db("classes").insert(classInfo);
}

//updates a class with the given id
async function editClass(classId, classInfo) {
  return db("classes")
    .where({ id: classId })
    .update(classInfo)
    .then((count) => {
      return count;
    });
}

//deletes a class with the given id
async function deleteClass(classId) {
  return db("classes").where({ id: classId }).del();
}

//returns an array of all students taking class with given id
async function getStudents(classId) {
  return db("students as s")
    .join("student_classes as sc", "sc.student_id", "s.id")
    .join("classes as c", "sc.class_id", "c.id")
    .select("s.name")
    .orderBy("s.id");
}
