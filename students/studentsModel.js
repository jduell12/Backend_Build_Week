const db = require("../data/dbConfig");

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  editStudent,
  deleteStudent,
  getTasks,
  getTasksIds,
  addTasks,
  editTask,
  deleteTask,
};

//returns an array of all students in the database
function getStudents() {
  return db("students");
}

//returns a student object with a given id
async function getStudentById(studentId) {
  return db("students").where({ id: studentId }).first();
}

//adds a student to the database
async function addStudent(student) {
  if (student.class_id) {
    const id = await db("students").insert(student);
    return db("student_classes").insert({
      student_id: id,
      class_id: student.class_id,
    });
  } else {
    return db("students").insert(student);
  }
}

//updates a student with the given id
async function editStudent(studentId, student) {
  if (student.class_id) {
    return db("student_classes")
      .where({ student_id: studentId })
      .where({ class_id: student.prevClassId })
      .update({ class_id: student.class_id })
      .then((count) => {
        return count;
      });
  } else {
    return db("students")
      .where({ id: studentId })
      .update(student)
      .then((count) => {
        return count;
      });
  }
}

//deletes student with given id
async function deleteStudent(studentId) {
  return db("students").where({ id: studentId }).del();
}

//returns an array of tasks the student is assigned
async function getTasks(studentId) {
  return db("tasks as t")
    .join("student_tasks as st", "st.task_id", "t.id")
    .join("students as s", "s.id", "st.student_id")
    .where("s.id", studentId)
    .select("t.id", "t.name", "t.description", "t.due_date", "t.completed")
    .orderBy("t.id");
}

//returns an array of task ids
async function getTasksIds(studentId) {
  return db("tasks as t")
    .join("student_tasks as st", "st.task_id", "t.id")
    .join("students as s", "s.id", "st.student_id")
    .where("s.id", studentId)
    .select("t.id")
    .orderBy("t.id");
}

//adds a task to the student's task list
async function addTasks(studentId, task) {
  const taskId = await db("tasks").insert(task).returning("id");
  return db("student_tasks").insert({ student_id: studentId, task_id: taskId });
}

//edits a task in the student's task list
async function editTask(studentId, taskId, task) {
  return db("tasks as t").where({ id: taskId }).update(task);
}

//deletes a task in the student's task list
async function deleteTask(taskId) {
  return db("tasks as t").where({ id: taskId }).del();
}
