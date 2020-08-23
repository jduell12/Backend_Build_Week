const db = require("../data/dbConfig");
const Classes = require("./classesModel");

describe("classesModel", () => {
  //wipes classes table in database clean so each test starts with empty tables
  beforeEach(async () => {
    await db("classes").truncate();
  });

  describe("getClasses()", () => {
    it("returns an empty array of classes from an empty db", async () => {
      const classes = await Classes.getClasses();
      expect(classes).not.toBeNull();
      expect(classes).toHaveLength(0);
    });

    it("returns an array of classes in the db", async () => {
      await db("classes").insert({ name: "CS" });
      await db("classes").insert({ name: "Psy" });
      await db("classes").insert({ name: "Math" });

      const expected = [
        { id: 1, name: "CS", description: null },
        { id: 2, name: "Psy", description: null },
        { id: 3, name: "Math", description: null },
      ];

      const classes = await Classes.getClasses();
      expect(classes).not.toBeNull();
      expect(classes).toHaveLength(3);
      expect(classes).toEqual(expect.arrayContaining(expected));
    });
  });

  describe("addClass(classInfo)", () => {
    it("adds a class to an empty database and returns the number of classes in db", async () => {
      const count = await Classes.addClass({ name: "CS" });
      expect(count).not.toBeNull();
      expect(count[0]).toBe(1);
    });

    it("adds a class to a non-empty database and returns the number of classes in db", async () => {
      await db("classes").insert({ name: "CS" });
      await db("classes").insert({ name: "Psy" });
      await db("classes").insert({ name: "Math" });
      await db("classes").insert({ name: "Psychology" });

      const count = await Classes.addClass({ name: "IT" });
      expect(count).not.toBeNull();
      expect(count[0]).toBe(5);
    });
  });

  describe("editClass(classId, classInfo)", () => {
    it("edits a class in the database and returns 1", async () => {
      await db("classes").insert({ name: "CS" });
      await db("classes").insert({ name: "Psy" });
      await db("classes").insert({ name: "Math" });
      await db("classes").insert({ name: "Psychology" });

      const expected = { id: 1, name: "Computer Science", description: null };

      const count = await Classes.editClass(1, { name: "Computer Science" });
      const updated = await db("classes").where({ id: 1 }).first();

      expect(count).not.toBeNull();
      expect(count).toBe(1);
      expect(updated).toEqual(expected);
    });

    it("returns 0 when edit fails due to wrong id", async () => {
      const count = await Classes.editClass(1, { name: "Computer Science" });
      expect(count).not.toBeNull();
      expect(count).toBe(0);
    });
  });

  describe("deleteClass(classId)", () => {
    it.todo("");

    it.todo("");
  });
});
