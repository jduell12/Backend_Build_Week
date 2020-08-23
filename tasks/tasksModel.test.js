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
    it.todo("");

    it.todo("");
  });

  describe("editTask", () => {
    it.todo("");

    it.todo("");
  });

  describe("deleteTask", () => {
    it.todo("");

    it.todo("");
  });
});
