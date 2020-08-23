const db = require("../data/dbConfig");
const Students = require("./studentsModel");

describe("studentsModel", () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    await db("students").truncate();
    await db("classes").truncate();
    await db("tasks").truncate();
  });

  describe("getStudents()", () => {
    it("it returns an empty array of students from an empty db", async () => {
      const students = await Students.getStudents();
      expect(students).toHaveLength(0);
    });

    it("it returns an array of students in the db", async () => {
      await db("students").insert({ name: "Wolf" });
      await db("students").insert({ name: "Kelly" });
      await db("students").insert({ name: "Dragon" });

      const expected = [
        { id: 1, name: "Wolf", class_id: null, task_id: null },
        { id: 2, name: "Kelly", class_id: null, task_id: null },
        { id: 3, name: "Dragon", class_id: null, task_id: null },
      ];

      const students = await Students.getStudents();
      expect(students).not.toBeNull();
      expect(students).toHaveLength(3);
      expect(students).toEqual(expect.arrayContaining(expected));
    });
  });

  describe("addStudent(student)", () => {
    it("adds a student to an empty database and returns the number of students", async () => {
      const student = { name: "Wolf" };

      const count = await Students.addStudent(student);
      expect(count).not.toBeNull();
      expect(count[0]).toBe(1);
    });

    it("adds a student to a non-empty database and returns the number of students", async () => {
      await db("students").insert({ name: "wolf" });
      await db("students").insert({ name: "kelly" });
      await db("students").insert({ name: "dragon" });

      const count = await Students.addStudent({ name: "Penguin" });
      expect(count).not.toBeNull();
      expect(count[0]).toBe(4);
    });
  });

  describe("editStudent(id, student)", () => {
    it("edits a student in the database and returns 1", async () => {
      await db("students").insert({ name: "wolf" });

      const expected = {
        id: 1,
        name: "awolf",
        task_id: null,
        class_id: null,
      };

      const count = await Students.editStudent(1, { name: "awolf" });
      const updatedStudent = await db("students").where({ id: 1 }).first();

      expect(count).not.toBeNull();
      expect(count).toBe(1);
      expect(updatedStudent).toEqual(expected);
    });

    it("returns 0 when edit fails due to wrong id", async () => {
      const count = await Students.editStudent(1, { name: "awolf" });
      expect(count).not.toBeNull();
      expect(count).toBe(0);
    });
  });

  describe("deleteStudent(id)", () => {
    it("returns 1 when successfully deletes a student from the db", async () => {
      await db("students").insert({ name: "wolf" });

      const count = await Students.deleteStudent(1);
      const find = await db("students").where({ id: 1 }).first();

      expect(count).not.toBeNull();
      expect(count).toBe(1);
      expect(find).toBeUndefined();
    });

    it("returns 0 when no student with the id is in the db", async () => {
      const count = await Students.deleteStudent(1);
      const find = await db("students").where({ id: 1 }).first();

      expect(count).not.toBeNull();
      expect(count).toBe(0);
      expect(find).toBeUndefined();
    });
  });
});
