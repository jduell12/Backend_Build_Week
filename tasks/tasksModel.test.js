const db = require("../data/dbConfig");
const Tasks = require("./tasksModel");

describe("tasksModel", () => {
  //wipes task tables in database clean so each test starts with task table
  beforeEach(async () => {
    await db("tasks").truncate();
  });

  describe("getTasks", () => {
    it("returns an empty array of tasks from an empty db", async () => {
      const tasks = await Tasks.getTasks();
      const dbTasks = await db("tasks");

      expect(tasks).toEqual(dbTasks);
    });

    it("returns an array of classes in the db", async () => {
      await db("tasks").insert({ name: "to do", due_date: "Sep 1, 2020" });
      await db("tasks").insert({ name: "to do2", due_date: "Sep 1, 2020" });
      await db("tasks").insert({ name: "to do3", due_date: "Sep 1, 2020" });

      const expected = [
        {
          id: 1,
          name: "to do",
          due_date: "Sep 1, 2020",
          completed: 0,
          description: null,
        },
        {
          id: 2,
          name: "to do2",
          due_date: "Sep 1, 2020",
          completed: 0,
          description: null,
        },
        {
          id: 3,
          name: "to do3",
          due_date: "Sep 1, 2020",
          completed: 0,
          description: null,
        },
      ];

      const tasks = await Tasks.getTasks();
      const dbTasks = await db("tasks");

      expect(tasks).toEqual(expect.arrayContaining(expected));
      expect(tasks).toEqual(dbTasks);
    });
  });

  describe("addTask", () => {
    it("adds a task to an empty database and returns the number of tasks", async () => {
      const count = await Tasks.addTask({
        name: "to do",
        due_date: "Sep 1, 2020",
      });

      const dbCount = await db("tasks");

      expect(count).not.toBeNull();
      expect(count[0]).toEqual(dbCount.length);
    });

    it("adds a task to a non-empty database and returns the number of tasks", async () => {
      await db("tasks").insert({ name: "to do", due_date: "Sep 1, 2020" });
      await db("tasks").insert({ name: "to do2", due_date: "Sep 1, 2020" });

      const expected = [
        {
          id: 1,
          name: "to do",
          due_date: "Sep 1, 2020",
          completed: 0,
          description: null,
        },
        {
          id: 2,
          name: "to do2",
          due_date: "Sep 1, 2020",
          completed: 0,
          description: null,
        },
        {
          id: 3,
          name: "to do3",
          due_date: "Sep 1, 2020",
          completed: 0,
          description: null,
        },
      ];

      const count = await Tasks.addTask({
        name: "to do3",
        due_date: "Sep 1, 2020",
      });
      const dbTasks = await db("tasks");

      expect(count).not.toBeNull();
      expect(count[0]).toBe(3);
      expect(count[0]).toBe(dbTasks.length);
      expect(dbTasks).toEqual(expect.arrayContaining(expected));
    });
  });

  describe("editTask", () => {
    it("edits a task in the database and returns 1", async () => {
      await db("tasks").insert({ name: "to do", due_date: "Sep 1, 2020" });

      const expected = [
        {
          id: 1,
          name: "todo",
          due_date: "Sep 1, 2020",
          completed: 0,
          description: null,
        },
      ];

      const count = await Tasks.editTask(1, { name: "todo" });
      const dbTasks = await db("tasks");

      expect(count).not.toBeNull();
      expect(count).toBe(1);
      expect(dbTasks).toEqual(expect.arrayContaining(expected));
    });

    it("returns 0 when edit fails due ot wrong id", async () => {
      const count = await Tasks.editTask(1, { name: "todo" });
      const dbTasks = await db("tasks");

      const expected = [];

      expect(count).not.toBeNull();
      expect(count).toBe(0);
      expect(dbTasks).toEqual(expect.arrayContaining(expected));
    });
  });

  describe("deleteTask", () => {
    it.todo("");

    it.todo("");
  });
});
