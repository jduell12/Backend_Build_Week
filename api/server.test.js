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

  //   describe("api GET requests", () => {
  //     //get student list of user ordered by classes
  //     describe("GET /user", () => {
  //       it("returns 200 OK when getting empty student list of user", async () => {
  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass" });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/users").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("returns empty student list in req.body.data for user with no students", async () => {
  //         await db("classes").insert({ name: "Security" });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/users").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual([]);
  //       });

  //       it("returns 200 OK when getting non-empty student list of user", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("students").insert({ name: "Frodo", class_id: 1 });
  //         await db("students").insert({ name: "Pippin", class_id: 1 });
  //         await db("students").insert({ name: "Merry", class_id: 1 });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/users").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("returns student list in req.body.data", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("students").insert({ name: "Frodo", class_id: 1 });
  //         await db("students").insert({ name: "Pippin", class_id: 1 });
  //         await db("students").insert({ name: "Merry", class_id: 1 });

  //         const exp = [
  //           {
  //             name: "Frodo",
  //           },
  //           {
  //             name: "Merry",
  //           },
  //           {
  //             name: "Pippin",
  //           },
  //         ];

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/users").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual(expect.arrayContaining(exp));
  //       });
  //     });

  //     //user's list of classes
  //     describe("GET /classes/", () => {
  //       it("returns 200 OK when getting empty class list of user", async () => {
  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass" });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("returns empty array when getting empty class list of user", async () => {
  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass" });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual([]);
  //       });

  //       it("returns 200 OK when getting class list of user from non-empty database", async () => {
  //         await db("classes").insert({ name: "CS" });
  //         await db("classes").insert({ name: "Psy" });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("returns class list of user from non-empty database", async () => {
  //         await db("classes").insert({ name: "CS" });
  //         await db("classes").insert({ name: "Psy" });

  //         const exp = [{ name: "CS" }];

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const dbClasses = await db("classes as c")
  //           .join("users_classes as uc", "uc.class_id", "c.id")
  //           .join("users as u", "uc.user_id", "u.id")
  //           .select("c.name")
  //           .orderBy("c.id");

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual(exp);
  //         expect(secondRes.body.data).toEqual(dbClasses);
  //       });
  //     });

  //     //student list for particular class
  //     describe("GET /classes/:id", () => {
  //       it("returns 200 OK when retrieving student list from a particular class of an empty students table", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("classes").insert({ name: "CS" });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes/1").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("returns empty array when retrieving student list from a particular class of an empty students table", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("classes").insert({ name: "CS" });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes/1").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual([]);
  //       });

  //       it("returns 200 OK when retrieving student list from a particular class of a non-empty db", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("classes").insert({ name: "CS" });
  //         await db("students").insert({ name: "Frodo", class_id: 1 });
  //         await db("students").insert({ name: "Pippin", class_id: 1 });
  //         await db("students").insert({ name: "Merry", class_id: 1 });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes/1").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("returns array of students taking a particular class from a non-empty db", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("classes").insert({ name: "CS" });

  //         await db("students").insert({ name: "Frodo", class_id: 1 });
  //         await db("students").insert({ name: "Pippin", class_id: 2 });
  //         await db("students").insert({ name: "Merry", class_id: 1 });

  //         await db("student_classes").insert({ student_id: 1, class_id: 1 });
  //         await db("student_classes").insert({ student_id: 2, class_id: 2 });
  //         await db("student_classes").insert({ student_id: 3, class_id: 1 });

  //         const exp = [{ name: "Frodo" }, { name: "Merry" }];

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/classes/1").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual(expect.arrayContaining(exp));
  //       });
  //     });

  //     //task list for particular student
  //     describe("GET /students/:id/tasks", () => {
  //       it("gets 200 OK when geting empty task list for a particular student", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("classes").insert({ name: "CS" });

  //         await db("students").insert({ name: "Frodo", class_id: 1 });
  //         await db("students").insert({ name: "Pippin", class_id: 2 });
  //         await db("students").insert({ name: "Merry", class_id: 1 });

  //         await db("student_classes").insert({ student_id: 1, class_id: 1 });
  //         await db("student_classes").insert({ student_id: 2, class_id: 2 });
  //         await db("student_classes").insert({ student_id: 3, class_id: 1 });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/students/1/tasks").set({
  //           authorization: token,
  //         });

  //         expect(firstRes.status).toBe(201);
  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("gets empty array when geting empty task list for a particular student", async () => {
  //         await db("classes").insert({ name: "Security" });
  //         await db("classes").insert({ name: "CS" });

  //         await db("students").insert({ name: "Frodo", class_id: 1 });
  //         await db("students").insert({ name: "Pippin", class_id: 2 });
  //         await db("students").insert({ name: "Merry", class_id: 1 });

  //         await db("student_classes").insert({ student_id: 1, class_id: 1 });
  //         await db("student_classes").insert({ student_id: 2, class_id: 2 });
  //         await db("student_classes").insert({ student_id: 3, class_id: 1 });

  //         const firstRes = await supertest(server)
  //           .post("/auth/register")
  //           .send({ username: "sam", password: "pass", class_id: 1 });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/students/1/tasks").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual([]);
  //       });

  //       it("gets 200 OK when geting task list for a particular student with a non-empty task list", async () => {
  //         await db("classes").insert({
  //           name: "Security",
  //         });
  //         await db("classes").insert({
  //           name: "CS",
  //         });

  //         await db("students").insert({
  //           name: "Frodo",
  //           class_id: 1,
  //         });
  //         await db("students").insert({
  //           name: "Pippin",
  //           class_id: 2,
  //         });
  //         await db("students").insert({
  //           name: "Merry",
  //           class_id: 1,
  //         });

  //         await db("student_classes").insert({
  //           student_id: 1,
  //           class_id: 1,
  //         });
  //         await db("student_classes").insert({
  //           student_id: 2,
  //           class_id: 2,
  //         });
  //         await db("student_classes").insert({
  //           student_id: 3,
  //           class_id: 1,
  //         });

  //         await db("tasks").insert({ name: "get ring", due_date: "1 year" });

  //         await db("student_tasks").insert({ student_id: 1, task_id: 1 });

  //         const firstRes = await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //           class_id: 1,
  //         });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/students/1/tasks").set({
  //           authorization: token,
  //         });

  //         expect(firstRes.status).toBe(201);
  //         expect(secondRes.status).toBe(200);
  //       });

  //       it("gets task list for a particular student with a non-empty task list", async () => {
  //         await db("classes").insert({
  //           name: "Security",
  //         });
  //         await db("classes").insert({
  //           name: "CS",
  //         });

  //         await db("students").insert({
  //           name: "Frodo",
  //           class_id: 1,
  //         });
  //         await db("students").insert({
  //           name: "Pippin",
  //           class_id: 2,
  //         });
  //         await db("students").insert({
  //           name: "Merry",
  //           class_id: 1,
  //         });

  //         await db("student_classes").insert({
  //           student_id: 1,
  //           class_id: 1,
  //         });
  //         await db("student_classes").insert({
  //           student_id: 2,
  //           class_id: 2,
  //         });
  //         await db("student_classes").insert({
  //           student_id: 3,
  //           class_id: 1,
  //         });

  //         await db("tasks").insert({ name: "get ring", due_date: "1 year" });

  //         await db("student_tasks").insert({ student_id: 1, task_id: 1 });

  //         const exp = [
  //           {
  //             name: "get ring",
  //             description: null,
  //             completed: 0,
  //             due_date: "1 year",
  //           },
  //         ];

  //         const firstRes = await supertest(server).post("/auth/register").send({
  //           username: "sam",
  //           password: "pass",
  //           class_id: 1,
  //         });

  //         const token = firstRes.body.token;

  //         const secondRes = await supertest(server).get("/students/1/tasks").set({
  //           authorization: token,
  //         });

  //         expect(secondRes.body.data).toEqual(exp);
  //       });
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

      it("returns 201 OK when user is created sucessfully", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        expect(res.status).toBe(201);
      });

      it("returns user username when registered successfully", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const exp = { username: "sam" };

        expect(res.body.data).toEqual(exp);
      });

      it("returns token when registered successfully", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        expect(res.body.token).not.toBeNull();
      });

      it("returns 400 when user has no username", async () => {
        const res = await supertest(server).post("/auth/register").send({
          password: "pass",
        });

        expect(res.status).toBe(400);
      });

      it("returns 'Please provide a username and password 'in res.body when user has no username", async () => {
        const res = await supertest(server).post("/auth/register").send({
          password: "pass",
        });

        expect(res.body.message).toBe("Please provide a username and password");
      });

      it("returns 400 when user has no password", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
        });

        expect(res.status).toBe(400);
      });

      it("returns 'Please provide a username and password 'in res.body when user has no password", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "pass",
        });

        expect(res.body.message).toBe("Please provide a username and password");
      });

      it("returns 400 when user has no username and no password ", async () => {
        const res = await supertest(server).post("/auth/register").send({});

        expect(res.status).toBe(400);
      });

      it("returns 'Please provide a username and password 'in res.body when user has no username and no password", async () => {
        const res = await supertest(server).post("/auth/register").send({});

        expect(res.body.message).toBe("Please provide a username and password");
      });
    });

    //logs in a user
    describe("POST /login", () => {
      it("returns 200 OK when logging in successfully", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "sam",
          password: "pass",
        });

        expect(res.status).toBe(200);
      });

      it("returns Welcome message in res.body when loggin in successfully", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "sam",
          password: "pass",
        });

        expect(res.body.message).toBe("Welcome");
      });

      it("returns token in res.body when logging in successfully", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "sam",
          password: "pass",
        });

        expect(res.body.token).not.toBeNull();
      });

      it("returns 400 when no username is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({
          password: "pass",
        });

        expect(res.status).toBe(400);
      });

      it("returns 'Please provide a username and password' in res.body when no username is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({
          password: "pass",
        });

        expect(res.body.message).toBe("Please provide a username and password");
      });

      it("returns 400 when no password is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "pass",
        });

        expect(res.status).toBe(400);
      });

      it("returns 'Please provide a username and password' in res.body when no password is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "pass",
        });

        expect(res.body.message).toBe("Please provide a username and password");
      });

      it("returns 400 when no username and no password are provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({});

        expect(res.status).toBe(400);
      });

      it("returns 'Please provide a username and password' in res.body when no username and no password are provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const res = await supertest(server).post("/auth/login").send({});

        expect(res.body.message).toBe("Please provide a username and password");
      });
    });

    //add a new class to user's class list
    describe("POST /users/classes", () => {
      it("adds a new class to the user's class list", async () => {
        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/users/classes")
          .send({
            name: "Security",
            description: "Learning to safeguard ",
          })
          .set({ authorization: token });

        const thirdRes = await supertest(server)
          .post("/users/classes")
          .send({
            name: "Adventure",
            description: "Learning to safeguard ",
          })
          .set({ authorization: token });

        const exp = [{ name: "Security" }, { name: "Adventure" }];

        const dbUserList = await db("classes as c")
          .join("users_classes as uc", "uc.class_id", "c.id")
          .join("users as u", "uc.user_id", "u.id")
          .select("c.name")
          .orderBy("c.id");

        expect(dbUserList).toHaveLength(2);
        expect(dbUserList).toEqual(expect.arrayContaining(exp));
      });

      it("receives 201 OK when adding a new class to the user's class list", async () => {
        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/users/classes")
          .send({
            name: "Security",
            description: "Learning to safeguard ",
          })
          .set({ authorization: token });

        const dbUserList = await db("classes as c")
          .join("users_classes as uc", "uc.class_id", "c.id")
          .join("users as u", "uc.user_id", "u.id")
          .select("c.name")
          .orderBy("c.id");

        expect(dbUserList).toHaveLength(1);
        expect(secondRes.status).toBe(201);
      });

      it("receives 406 Not Acceptable when adding a new class to the user's class list without the required elements", async () => {
        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/users/classes")
          .send({
            description: "Learning to safeguard ",
          })
          .set({ authorization: token });

        const dbUserList = await db("classes as c")
          .join("users_classes as uc", "uc.class_id", "c.id")
          .join("users as u", "uc.user_id", "u.id")
          .select("c.name")
          .orderBy("c.id");

        expect(dbUserList).toHaveLength(0);
        expect(secondRes.status).toBe(406);
      });

      it("receives 'Please enter all required fields to add the class.' in res.body when adding a new class to the user's class list without the required elements", async () => {
        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/users/classes")
          .send({
            description: "Learning to safeguard ",
          })
          .set({ authorization: token });

        const dbUserList = await db("classes as c")
          .join("users_classes as uc", "uc.class_id", "c.id")
          .join("users as u", "uc.user_id", "u.id")
          .select("c.name")
          .orderBy("c.id");

        expect(dbUserList).toHaveLength(0);
        expect(secondRes.body.message).toBe(
          "Please enter all required fields to add the class.",
        );
      });
    });

    //add student to current user's student list
    describe("POST /users/students", () => {
      it("sends 201 OK when adding a new student to the user's list", async () => {
        await db("classes").insert({ name: "CS" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        await db("users_classes").insert({ user_id: 1, class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/users/students")
          .send({ name: "Frodo", class_id: 1 })
          .set({ authorization: token });

        expect(secondRes.status).toBe(201);
      });

      it("sends 'Success' message in res.body when adding a new student to the user's list", async () => {
        await db("classes").insert({ name: "CS" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        await db("users_classes").insert({ user_id: 1, class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/users/students")
          .send({ name: "Frodo", class_id: 1 })
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Success");
      });

      it("Successfully adds a new student to the user's list", async () => {
        await db("classes").insert({ name: "CS" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        await db("users_classes").insert({ user_id: 1, class_id: 1 });

        const exp = [{ name: "Frodo" }, { name: "Merry" }];

        const token = firstRes.body.token;

        await supertest(server)
          .post("/users/students")
          .send({ name: "Frodo", class_id: 1 })
          .set({ authorization: token });

        await supertest(server)
          .post("/users/students")
          .send({ name: "Merry", class_id: 1 })
          .set({ authorization: token });

        const dbStudentList = await db("students as s")
          .join("users as u", 1, 1)
          .select("s.name")
          .orderBy("s.id");

        expect(dbStudentList).toEqual(exp);
      });
    });

    //add task for particular student
    describe("POST /students/:id/tasks", () => {
      it("adds a task to a particular students empty task list ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        const expTask = [
          {
            task: "pick a thesis topic",
            description: "find a good topic to research",
            due_date: "Oct 1, 2020",
            completed: 0,
            student: "wolf",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            name: "pick a thesis topic",
            description: "find a good topic to research",
            due_date: "Oct 1, 2020",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        const dbTaskList = await db("student_tasks as st")
          .join("tasks as t", "st.task_id", "t.id")
          .join("students as s", "st.student_id", "s.id")
          .select(
            "t.name as task",
            "t.description",
            "t.due_date",
            "t.completed",
            "s.name as student",
          )
          .orderBy("s.id");

        expect(dbTaskList).toEqual(expTask);
      });

      it.only("adds a task to a particular students non-empty task list ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        await db("tasks").insert({
          name: "to do list",
          due_date: "Sept 1, 2020",
        });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const expTask = [
          {
            task: "to do list",
            description: null,
            due_date: "Sept 1, 2020",
            completed: 0,
            student: "wolf",
          },
          {
            task: "pick a thesis topic",
            description: "find a good topic to research",
            due_date: "Oct 1, 2020",
            completed: 0,
            student: "wolf",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            name: "pick a thesis topic",
            description: "find a good topic to research",
            due_date: "Oct 1, 2020",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        const dbTaskList = await db("student_tasks as st")
          .join("tasks as t", "st.task_id", "t.id")
          .join("students as s", "st.student_id", "s.id")
          .select(
            "t.name as task",
            "t.description",
            "t.due_date",
            "t.completed",
            "s.name as student",
          )
          .orderBy("s.id");

        expect(dbTaskList).toEqual(expTask);
      });

      it.todo("");

      it.todo("");

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
