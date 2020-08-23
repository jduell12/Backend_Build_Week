const supertest = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

describe("server", () => {
  //clear db tables before each test
  beforeEach(async () => {
    await db("users").truncate();
    await db("students").truncate();
    await db("classes").truncate();
    await db("users_classes").truncate();
    await db("tasks").truncate();
    await db("professor_students").truncate();
    await db("student_tasks").truncate();
    await db("student_classes").truncate();
  });

  describe("GET /", () => {
    it("returns 200 OK", async () => {
      const res = await supertest(server).get("/");
      expect(res.status).toBe(200);
    });

    it("returns json object {server: working}", async () => {
      const res = await supertest(server).get("/");
      expect(res.body.server).toBe("working");
    });
  });

  //   describe("api GET requests", () => {
  //     //get student list of user ordered by classes
  //     describe("GET /user", () => {
  //       it.todo("");
  //     });

  //     //user's list of classes
  //     describe("GET /classes/", () => {
  //       it.todo("");
  //     });

  //     //student list for particular class
  //     describe("GET /classes/:id", () => {
  //       it.todo("");
  //     });

  //     //task list for particular student
  //     describe("GET /students/:id/tasks", () => {
  //       it.todo("");
  //     });
  //   });

  describe("api POST request to add to db", () => {
    //add a new user
    describe("POST /register", () => {
      it("adds a new user to an empty db", async () => {
        const users = await db("users");
        expect(users).toHaveLength(0);

        await db("classes").insert({ name: "Security" });

        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          class_id: 1,
        });

        const newUsers = await db("users");
        expect(newUsers).toHaveLength(1);
      });

      it("adds a new user to a db with users in it", async () => {
        const users = await db("users");
        expect(users).toHaveLength(0);

        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Security" });

        await db("users").insert({
          username: "pippin",
          password: "pass",
          class_id: 1,
        });
        await db("users").insert({ username: "frodo", password: "pass" });
        await db("users").insert({ username: "merry", password: "pass" });

        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          class_id: 2,
        });

        const newUsers = await db("users");
        expect(newUsers).toHaveLength(4);
      });

      it.todo("");

      it.todo("");

      it.todo("");

      it.todo("");
    });

    //logs in a user
    describe("POST /login", () => {
      it.todo("");
    });

    //add a new class to user's class list
    describe("POST /user/classes", () => {
      it.todo("");
    });

    //add student to current user's student list
    describe("POST /user/students", () => {
      it.todo("");
    });

    //add task for particular student
    describe("POST /students/:id/tasks", () => {
      it.todo("");
    });
  });

  //   describe("api POST request to edit db", () => {
  //     //edit user's information
  //     describe("POST /user/info", () => {
  //       it.todo("");
  //     });

  //     //edit class information
  //     describe("POST /classes/:id", () => {
  //       it.todo("");
  //     });

  //     //edit student information
  //     describe("POST /user/students/:id", () => {
  //       it.todo("");
  //     });

  //     //edit a task for particular student
  //     describe("POST /students/:id/tasks/:id", () => {
  //       it.todo("");
  //     });
  //   });

  //   describe("api DELETE requests", () => {
  //     //delete user
  //     describe("DELETE /user", () => {
  //       it.todo("");
  //     });

  //     //delete class
  //     describe("DELETE /classes/:id", () => {
  //       it.todo("");
  //     });

  //     //delete student from user's student list
  //     describe("DELETE /user/students/:id", () => {
  //       it.todo("");
  //     });

  //     //delete task from particular student
  //     describe("DELETE /students/:id/tasks/:id", () => {
  //       it.todo("");
  //     });
  //   });
});
