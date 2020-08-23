const supertest = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const { setMaxListeners } = require("./server");

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

  describe("api GET requests", () => {
    //get student list of user ordered by classes
    describe("GET /user", () => {
      it("returns 200 OK when getting empty student list of user", async () => {
        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass" });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/users").set({
          authorization: token,
        });

        expect(secondRes.status).toBe(200);
      });

      it("returns empty student list in req.body.data for user with no students", async () => {
        await db("classes").insert({ name: "Security" });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/users").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual([]);
      });

      it("returns 200 OK when getting non-empty student list of user", async () => {
        await db("classes").insert({ name: "Security" });
        await db("students").insert({ name: "Frodo", class_id: 1 });
        await db("students").insert({ name: "Pippin", class_id: 1 });
        await db("students").insert({ name: "Merry", class_id: 1 });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/users").set({
          authorization: token,
        });

        expect(secondRes.status).toBe(200);
      });

      it("returns student list in req.body.data", async () => {
        await db("classes").insert({ name: "Security" });
        await db("students").insert({ name: "Frodo", class_id: 1 });
        await db("students").insert({ name: "Pippin", class_id: 1 });
        await db("students").insert({ name: "Merry", class_id: 1 });

        const exp = [
          {
            name: "Frodo",
          },
          {
            name: "Merry",
          },
          {
            name: "Pippin",
          },
        ];

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/users").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual(expect.arrayContaining(exp));
      });
    });

    //user's list of classes
    describe("GET /classes/", () => {
      it("returns 200 OK when getting empty class list of user", async () => {
        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass" });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes").set({
          authorization: token,
        });

        expect(secondRes.status).toBe(200);
      });

      it.only("returns empty array when getting empty class list of user", async () => {
        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass" });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual([]);
      });
    });

    //student list for particular class
    describe("GET /classes/:id", () => {
      it.todo("");
    });

    //task list for particular student
    describe("GET /students/:id/tasks", () => {
      it.todo("");
    });
  });

  //   describe("api POST request to add to db", () => {
  //     //add a new user
  //     describe("POST /register", () => {
  //       it("adds a new user to an empty db", async () => {
  //         const users = await db("users");
  //         expect(users).toHaveLength(0);

  //         await db("classes").insert({ name: "Security" });

  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //           class_id: 1,
  //         });

  //         const newUsers = await db("users");
  //         expect(newUsers).toHaveLength(1);
  //       });

  //       it("adds a new user to a db with users in it", async () => {
  //         const users = await db("users");
  //         expect(users).toHaveLength(0);

  //         await db("classes").insert({ name: "CS" });
  //         await db("classes").insert({ name: "Security" });

  //         await db("users").insert({
  //           username: "pippin",
  //           password: "pass",
  //           class_id: 1,
  //         });
  //         await db("users").insert({ username: "frodo", password: "pass" });
  //         await db("users").insert({ username: "merry", password: "pass" });

  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //           class_id: 2,
  //         });

  //         const newUsers = await db("users");
  //         expect(newUsers).toHaveLength(4);
  //       });

  //       it("returns 201 OK when user is created sucessfully", async () => {
  //         const res = await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         expect(res.status).toBe(201);
  //       });

  //       it("returns user username when registered successfully", async () => {
  //         const res = await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const exp = { username: "sam" };

  //         expect(res.body.data).toEqual(exp);
  //       });

  //       it("returns token when registered successfully", async () => {
  //         const res = await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         expect(res.body.token).not.toBeNull();
  //       });

  //       it("returns 400 when user has no username", async () => {
  //         const res = await supertest(server).post("/auth/register").send({
  //           password: "pass",
  //         });

  //         expect(res.status).toBe(400);
  //       });

  //       it("returns 'Please provide a username and password 'in res.body when user has no username", async () => {
  //         const res = await supertest(server).post("/auth/register").send({
  //           password: "pass",
  //         });

  //         expect(res.body.message).toBe("Please provide a username and password");
  //       });

  //       it("returns 400 when user has no password", async () => {
  //         const res = await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //         });

  //         expect(res.status).toBe(400);
  //       });

  //       it("returns 'Please provide a username and password 'in res.body when user has no password", async () => {
  //         const res = await supertest(server).post("/auth/register").send({
  //           username: "pass",
  //         });

  //         expect(res.body.message).toBe("Please provide a username and password");
  //       });

  //       it("returns 400 when user has no username and no password ", async () => {
  //         const res = await supertest(server).post("/auth/register").send({});

  //         expect(res.status).toBe(400);
  //       });

  //       it("returns 'Please provide a username and password 'in res.body when user has no username and no password", async () => {
  //         const res = await supertest(server).post("/auth/register").send({});

  //         expect(res.body.message).toBe("Please provide a username and password");
  //       });
  //     });

  //     //logs in a user
  //     describe("POST /login", () => {
  //       it("returns 200 OK when logging in successfully", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         expect(res.status).toBe(200);
  //       });

  //       it("returns Welcome message in res.body when loggin in successfully", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         expect(res.body.message).toBe("Welcome");
  //       });

  //       it("returns token in res.body when logging in successfully", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         expect(res.body.token).not.toBeNull();
  //       });

  //       it("returns 400 when no username is provided", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({
  //           password: "pass",
  //         });

  //         expect(res.status).toBe(400);
  //       });

  //       it("returns 'Please provide a username and password' in res.body when no username is provided", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({
  //           password: "pass",
  //         });

  //         expect(res.body.message).toBe("Please provide a username and password");
  //       });

  //       it("returns 400 when no password is provided", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({
  //           username: "pass",
  //         });

  //         expect(res.status).toBe(400);
  //       });

  //       it("returns 'Please provide a username and password' in res.body when no password is provided", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({
  //           username: "pass",
  //         });

  //         expect(res.body.message).toBe("Please provide a username and password");
  //       });

  //       it("returns 400 when no username and no password are provided", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({});

  //         expect(res.status).toBe(400);
  //       });

  //       it("returns 'Please provide a username and password' in res.body when no username and no password are provided", async () => {
  //         await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //         });

  //         const res = await supertest(server).post("/auth/login").send({});

  //         expect(res.body.message).toBe("Please provide a username and password");
  //       });
  //     });

  //     //add a new class to user's class list
  //     describe("POST /user/classes", () => {
  //       it.todo("");
  //     });

  //     //add student to current user's student list
  //     describe("POST /user/students", () => {
  //       it.todo("");
  //     });

  //     //add task for particular student
  //     describe("POST /students/:id/tasks", () => {
  //       it.todo("");
  //     });
  //   });

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
