const supertest = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const { first } = require("../data/dbConfig");

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
    describe("GET /users", () => {
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

      it("returns empty array when getting empty class list of user", async () => {
        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass" });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual([]);
      });

      it("returns 200 OK when getting class list of user from non-empty database", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes").set({
          authorization: token,
        });

        expect(secondRes.status).toBe(200);
      });

      it("returns class list of user from non-empty database", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });

        const exp = [{ name: "CS" }];

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const dbClasses = await db("classes as c")
          .join("users_classes as uc", "uc.class_id", "c.id")
          .join("users as u", "uc.user_id", "u.id")
          .select("c.name")
          .orderBy("c.id");

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual(exp);
        expect(secondRes.body.data).toEqual(dbClasses);
      });
    });

    //student list for particular class
    describe("GET /classes/:id", () => {
      it("returns 200 OK when retrieving student list from a particular class of an empty students table", async () => {
        await db("classes").insert({ name: "Security" });
        await db("classes").insert({ name: "CS" });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes/1").set({
          authorization: token,
        });

        expect(secondRes.status).toBe(200);
      });

      it("returns empty array when retrieving student list from a particular class of an empty students table", async () => {
        await db("classes").insert({ name: "Security" });
        await db("classes").insert({ name: "CS" });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes/1").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual([]);
      });

      it("returns 200 OK when retrieving student list from a particular class of a non-empty db", async () => {
        await db("classes").insert({ name: "Security" });
        await db("classes").insert({ name: "CS" });
        await db("students").insert({ name: "Frodo", class_id: 1 });
        await db("students").insert({ name: "Pippin", class_id: 1 });
        await db("students").insert({ name: "Merry", class_id: 1 });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes/1").set({
          authorization: token,
        });

        expect(secondRes.status).toBe(200);
      });

      it("returns array of students taking a particular class from a non-empty db", async () => {
        await db("classes").insert({ name: "Security" });
        await db("classes").insert({ name: "CS" });

        await db("students").insert({ name: "Frodo", class_id: 1 });
        await db("students").insert({ name: "Pippin", class_id: 2 });
        await db("students").insert({ name: "Merry", class_id: 1 });

        await db("student_classes").insert({ student_id: 1, class_id: 1 });
        await db("student_classes").insert({ student_id: 2, class_id: 2 });
        await db("student_classes").insert({ student_id: 3, class_id: 1 });

        const exp = [{ name: "Frodo" }, { name: "Merry" }];

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/classes/1").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual(expect.arrayContaining(exp));
      });
    });

    //task list for particular student
    describe("GET /students/:id/tasks", () => {
      it("gets 200 OK when geting empty task list for a particular student", async () => {
        await db("classes").insert({ name: "Security" });
        await db("classes").insert({ name: "CS" });

        await db("students").insert({ name: "Frodo", class_id: 1 });
        await db("students").insert({ name: "Pippin", class_id: 2 });
        await db("students").insert({ name: "Merry", class_id: 1 });

        await db("student_classes").insert({ student_id: 1, class_id: 1 });
        await db("student_classes").insert({ student_id: 2, class_id: 2 });
        await db("student_classes").insert({ student_id: 3, class_id: 1 });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/students/1/tasks").set({
          authorization: token,
        });

        expect(firstRes.status).toBe(201);
        expect(secondRes.status).toBe(200);
      });

      it("gets empty array when geting empty task list for a particular student", async () => {
        await db("classes").insert({ name: "Security" });
        await db("classes").insert({ name: "CS" });

        await db("students").insert({ name: "Frodo", class_id: 1 });
        await db("students").insert({ name: "Pippin", class_id: 2 });
        await db("students").insert({ name: "Merry", class_id: 1 });

        await db("student_classes").insert({ student_id: 1, class_id: 1 });
        await db("student_classes").insert({ student_id: 2, class_id: 2 });
        await db("student_classes").insert({ student_id: 3, class_id: 1 });

        const firstRes = await supertest(server)
          .post("/auth/register")
          .send({ username: "sam", password: "pass", class_id: 1 });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/students/1/tasks").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual([]);
      });

      it("gets 200 OK when geting task list for a particular student with a non-empty task list", async () => {
        await db("classes").insert({
          name: "Security",
        });
        await db("classes").insert({
          name: "CS",
        });

        await db("students").insert({
          name: "Frodo",
          class_id: 1,
        });
        await db("students").insert({
          name: "Pippin",
          class_id: 2,
        });
        await db("students").insert({
          name: "Merry",
          class_id: 1,
        });

        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 2,
          class_id: 2,
        });
        await db("student_classes").insert({
          student_id: 3,
          class_id: 1,
        });

        await db("tasks").insert({ name: "get ring", due_date: "1 year" });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          class_id: 1,
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/students/1/tasks").set({
          authorization: token,
        });

        expect(firstRes.status).toBe(201);
        expect(secondRes.status).toBe(200);
      });

      it("gets task list for a particular student with a non-empty task list", async () => {
        await db("classes").insert({
          name: "Security",
        });
        await db("classes").insert({
          name: "CS",
        });

        await db("students").insert({
          name: "Frodo",
          class_id: 1,
        });
        await db("students").insert({
          name: "Pippin",
          class_id: 2,
        });
        await db("students").insert({
          name: "Merry",
          class_id: 1,
        });

        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 2,
          class_id: 2,
        });
        await db("student_classes").insert({
          student_id: 3,
          class_id: 1,
        });

        await db("tasks").insert({ name: "get ring", due_date: "1 year" });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const exp = [
          {
            id: 1,
            name: "get ring",
            description: null,
            completed: 0,
            due_date: "1 year",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          class_id: 1,
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server).get("/students/1/tasks").set({
          authorization: token,
        });

        expect(secondRes.body.data).toEqual(exp);
      });
    });
  });

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

        expect(res.body.token).not.toBeNull();
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
        await db("classes").insert({ name: "Math" });
        await db("users").insert({ username: "bill", password: "pass" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          class_id: 1,
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

        const fourthRes = await supertest(server)
          .get("/classes")
          .set({ authorization: token });

        const exp = [
          { name: "Math" },
          { name: "Security" },
          { name: "Adventure" },
        ];

        const dbUserList = await db("classes as c")
          .join("users_classes as uc", "uc.class_id", "c.id")
          .join("users as u", "uc.user_id", "u.id")
          .select("c.name")
          .orderBy("c.id");

        expect(dbUserList).toHaveLength(3);
        expect(dbUserList).toEqual(exp);
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

      it("sends a success message 'Added a task' when adding a task to a particular students empty task list ", async () => {
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

        expect(secondRes.body.message).toBe("Added a task");
      });

      it("adds a task to a particular students non-empty task list ", async () => {
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

      it("sends a success message 'Added a task' when adding a task to a particular students non-empty task list ", async () => {
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

        expect(secondRes.body.message).toBe("Added a task");
      });

      it("sends 201 OK when adding a task to a particular student", async () => {
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

        expect(secondRes.status).toBe(201);
      });

      it("sends 406 client error status when task is missing a required field (name) ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        await db("tasks").insert({
          name: "to do list",
          due_date: "Sept 1, 2020",
        });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            description: "find a good topic to research",
            due_date: "Oct 1, 2020",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(406);
      });

      it("sends error message 'Please supply all required fields to add a task' when task is missing a required field (name) ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        await db("tasks").insert({
          name: "to do list",
          due_date: "Sept 1, 2020",
        });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            description: "find a good topic to research",
            due_date: "Oct 1, 2020",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe(
          "Please supply all required fields to add a task",
        );
      });

      it("sends 406 client error status when task is missing a required field (due_date) ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        await db("tasks").insert({
          name: "to do list",
          due_date: "Sept 1, 2020",
        });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            name: "to do",
            description: "find a good topic to research",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(406);
      });

      it("sends error message 'Please supply all required fields to add a task' when task is missing a required field (due_date) ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        await db("tasks").insert({
          name: "to do list",
          due_date: "Sept 1, 2020",
        });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            name: "to do",
            description: "find a good topic to research",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe(
          "Please supply all required fields to add a task",
        );
      });

      it("sends 406 client error status when task is missing required fields (name and due_date) ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        await db("tasks").insert({
          name: "to do list",
          due_date: "Sept 1, 2020",
        });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            description: "find a good topic to research",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(406);
      });

      it("sends error message 'Please supply all required fields to add a task' when task is missing all required fields (name, due_date) ", async () => {
        await db("students").insert({
          name: "wolf",
        });

        await db("tasks").insert({
          name: "to do list",
          due_date: "Sept 1, 2020",
        });

        await db("student_tasks").insert({ student_id: 1, task_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .post("/students/1/tasks")
          .send({
            name: "to do",
            completed: 0,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe(
          "Please supply all required fields to add a task",
        );
      });
    });
  });

  describe("api PUT requests to edit db", () => {
    //edit class information
    describe("PUT /classes/:id", () => {
      it("edits the class information of a particular class", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const expClass = [
          {
            id: 1,
            name: "Computer Science",
            description: null,
          },
          {
            id: 2,
            name: "Psy",
            description: null,
          },
          {
            id: 3,
            name: "Math",
            description: null,
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await db("users_classes").insert({ class_id: 1, user_id: 1 });

        const secondRes = await supertest(server)
          .put("/classes/1")
          .send({
            name: "Computer Science",
          })
          .set({
            authorization: token,
          });

        const dbClasses = await db("classes");

        expect(dbClasses).toEqual(expClass);
      });

      it("sends 200 when successfully editing the class information of a particular class", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await db("users_classes").insert({ class_id: 1, user_id: 1 });

        const secondRes = await supertest(server)
          .put("/classes/1")
          .send({
            name: "Computer Science",
          })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Success' when successfully editing the class information of a particular class", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await db("users_classes").insert({ class_id: 1, user_id: 1 });

        const secondRes = await supertest(server)
          .put("/classes/1")
          .send({
            name: "Computer Science",
          })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe("Success");
      });

      it("sends error message 'Please provide a name for the class' when not supplying the new name of the class that's being edited", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await db("users_classes").insert({ class_id: 1, user_id: 1 });

        const secondRes = await supertest(server).put("/classes/1").send().set({
          authorization: token,
        });

        expect(secondRes.body.message).toBe(
          "Please provide a name for the class",
        );
      });

      it("sends 406 client error when not supplying the new name of the class that's being edited", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await db("users_classes").insert({ class_id: 1, user_id: 1 });

        const secondRes = await supertest(server).put("/classes/1").send().set({
          authorization: token,
        });

        expect(secondRes.status).toBe(406);
      });
    });

    //edit student information
    describe("PUT /users/students/:id", () => {
      it("edits the name of a particular student ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const expStudent = [{ name: "Kelly", class: "CS" }];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({
            name: "Kelly",
          })
          .set({
            authorization: token,
          });

        const dbStudent = await db("student_classes as sc")
          .join("students as s", "sc.student_id", "s.id")
          .join("classes as c", "sc.class_id", "c.id")
          .select("s.name", "c.name as class")
          .orderBy("s.id");

        expect(dbStudent).toEqual(expStudent);
      });

      it("sends 200 OK when editing the name of a particular student ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({
            name: "Kelly",
          })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Edited student successfully' when editing the name of a particular student ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({
            name: "Kelly",
          })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe("Edited student successfully");
      });

      it("edits the class of a particular student ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("classes").insert({
          name: "Psy",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const expStudent = [{ name: "wolf", class: "Psy" }];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({
            class_id: 2,
            prevClassId: 1,
          })
          .set({
            authorization: token,
          });

        const dbStudent = await db("student_classes as sc")
          .join("students as s", "sc.student_id", "s.id")
          .join("classes as c", "sc.class_id", "c.id")
          .select("s.name", "c.name as class")
          .orderBy("s.id");

        expect(dbStudent).toEqual(expStudent);
      });

      it("sends 200 OK when editing the class of a particular student ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("classes").insert({
          name: "Psy",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const expStudent = [{ name: "wolf", class: "Psy" }];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({
            class_id: 2,
            prevClassId: 1,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Edited student successfully' when editing the class of a particular student ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("classes").insert({
          name: "Psy",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const expStudent = [{ name: "wolf", class: "Psy" }];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({
            class_id: 2,
            prevClassId: 1,
          })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe("Edited student successfully");
      });

      it("sends 406 client error when client doesn't provide name of student to edit ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({})
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(406);
      });

      it("sends message 'Please provide a name for the student or the current class id and previous class id' when client doesn't provide name of student to edit ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({})
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe(
          "Please provide a name for the student or the current class id and previous class id",
        );
      });

      it("sends 406 client error when client doesn't provide previous class id of student to edit ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({ class_id: 2 })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(406);
      });

      it("sends message 'Please provide a name for the student or the current class id and previous class id' when client doesn't provide previous class id of student to edit ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({ class_id: 2 })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe(
          "Please provide a name for the student or the current class id and previous class id",
        );
      });

      it("sends 406 client error when client doesn't provide current class id of student to edit ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({ prevClassId: 2 })
          .set({
            authorization: token,
          });

        expect(secondRes.status).toBe(406);
      });

      it("sends message 'Please provide a name for the student or the current class id and previous class id' when client doesn't provide current class id of student to edit ", async () => {
        await db("classes").insert({
          name: "CS",
        });
        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("student_classes").insert({
          student_id: 1,
          class_id: 1,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/users/students/1")
          .send({ prevClassId: 2 })
          .set({
            authorization: token,
          });

        expect(secondRes.body.message).toBe(
          "Please provide a name for the student or the current class id and previous class id",
        );
      });
    });

    //edit a task for particular student
    describe("PUT /students/:id/tasks/:id", () => {
      //name
      it("successfully edits name of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const expTasks = [
          {
            completed: 0,
            description: null,
            due_date: "Sept 1, 2020",
            name: "find thesis",
            student: "wolf",
          },
          {
            completed: 0,
            description: null,
            due_date: "Sept 1, 2020",
            name: "to do",
            student: "wolf",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await supertest(server)
          .put("/students/1/tasks/1")
          .send({ name: "find thesis" })
          .set({ authorization: token });

        const dbTasks = await db("tasks as t")
          .join("student_tasks as st", "st.task_id", "t.id")
          .join("students as s", "s.id", "st.student_id")
          .select(
            "t.name",
            "t.description",
            "t.due_date",
            "t.completed",
            "s.name as student",
          )
          .orderBy("t.id");

        expect(dbTasks).toEqual(expTasks);
      });

      it("sends 200 OK when successfully edits name of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/1")
          .send({ name: "find thesis" })
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Edited task successfully' when successfully edits name of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/1")
          .send({ name: "find thesis" })
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Edited task successfully");
      });

      //due_date
      it("successfully edits due_date of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const expTasks = [
          {
            completed: 0,
            description: null,
            due_date: "Sept 1, 2020",
            name: "thesis",
            student: "wolf",
          },
          {
            completed: 0,
            description: null,
            due_date: "Oct 1, 2020",
            name: "to do",
            student: "wolf",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await supertest(server)
          .put("/students/1/tasks/2")
          .send({ due_date: "Oct 1, 2020" })
          .set({ authorization: token });

        const dbTasks = await db("tasks as t")
          .join("student_tasks as st", "st.task_id", "t.id")
          .join("students as s", "s.id", "st.student_id")
          .select(
            "t.name",
            "t.description",
            "t.due_date",
            "t.completed",
            "s.name as student",
          )
          .orderBy("t.id");

        expect(dbTasks).toEqual(expTasks);
      });

      it("sends 200 OK when successfully edits due_date of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/2")
          .send({ due_date: "Oct 1, 2020" })
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Edited task successully' when successfully edits due_date of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/2")
          .send({ due_date: "Oct 1, 2020" })
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Edited task successfully");
      });

      //description
      it("successfully edits description of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const expTasks = [
          {
            completed: 0,
            description: "find topic",
            due_date: "Sept 1, 2020",
            name: "thesis",
            student: "wolf",
          },
          {
            completed: 0,
            description: null,
            due_date: "Sept 1, 2020",
            name: "to do",
            student: "wolf",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await supertest(server)
          .put("/students/1/tasks/1")
          .send({ description: "find topic" })
          .set({ authorization: token });

        const dbTasks = await db("tasks as t")
          .join("student_tasks as st", "st.task_id", "t.id")
          .join("students as s", "s.id", "st.student_id")
          .select(
            "t.name",
            "t.description",
            "t.due_date",
            "t.completed",
            "s.name as student",
          )
          .orderBy("t.id");

        expect(dbTasks).toEqual(expTasks);
      });

      it("sends 200 OK when successfully edits description of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/1")
          .send({ description: "find topic" })
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Edited task successfully' when successfully edits description of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/1")
          .send({ description: "find topic" })
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Edited task successfully");
      });

      //completed
      it("successfully edits completed of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const expTasks = [
          {
            completed: 0,
            description: null,
            due_date: "Sept 1, 2020",
            name: "thesis",
            student: "wolf",
          },
          {
            completed: 1,
            description: null,
            due_date: "Sept 1, 2020",
            name: "to do",
            student: "wolf",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await supertest(server)
          .put("/students/1/tasks/2")
          .send({ completed: true })
          .set({ authorization: token });

        const dbTasks = await db("tasks as t")
          .join("student_tasks as st", "st.task_id", "t.id")
          .join("students as s", "s.id", "st.student_id")
          .select(
            "t.name",
            "t.description",
            "t.due_date",
            "t.completed",
            "s.name as student",
          )
          .orderBy("t.id");

        expect(dbTasks).toEqual(expTasks);
      });

      it("sends 200 OK when successfully edits completed of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/2")
          .send({ completed: true })
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Edited task successfully' when successfully edits completed of a task of a particular student", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({ name: "thesis", due_date: "Sept 1, 2020" });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/2")
          .send({ completed: true })
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Edited task successfully");
      });

      it("sends 406 client error when no information is supplied", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({
          name: "thesis",
          due_date: "Sept 1, 2020",
        });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/1")
          .send({})
          .set({ authorization: token });

        expect(secondRes.status).toBe(406);
      });

      it("sends error message 'Please provide information for the task' when no information is supplied", async () => {
        await db("students").insert({ name: "wolf" });
        await db("tasks").insert({
          name: "thesis",
          due_date: "Sept 1, 2020",
        });
        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("student_tasks").insert({ student_id: 1, task_id: 1 });
        await db("student_tasks").insert({ student_id: 1, task_id: 2 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .put("/students/1/tasks/1")
          .send({})
          .set({ authorization: token });

        expect(secondRes.body.message).toBe(
          "Please provide information for the task",
        );
      });
    });
  });

  describe("api DELETE requests", () => {
    //delete user
    describe("DELETE /users", () => {
      it("deletes a user successfully from the db", async () => {
        const expUsers = [
          { username: "wolf", password: "kelly", class_id: null, id: 2 },
          { username: "pup", password: "kelly", class_id: null, id: 3 },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await db("users").insert({ username: "wolf", password: "kelly" });
        await db("users").insert({ username: "pup", password: "kelly" });

        await supertest(server).delete("/users").set({ authorization: token });

        const usersDb = await db("users");
        expect(usersDb).toEqual(expUsers);
      });

      it("sends 200 OK when deleting a user successfully from the db", async () => {
        await db("users").insert({ username: "wolf", password: "kelly" });
        await db("users").insert({ username: "pup", password: "kelly" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/users")
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'User deleted Successfully' when deleting a user successfully from the db", async () => {
        await db("users").insert({ username: "wolf", password: "kelly" });
        await db("users").insert({ username: "pup", password: "kelly" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/users")
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("User deleted Successfully");
      });
    });

    //delete class
    describe("DELETE /classes/:id", () => {
      it("deletes a class successfully from the db", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const expClasses = [
          { name: "CS", id: 1 },
          { name: "Math", id: 3 },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await supertest(server)
          .delete("/classes/2")
          .set({ authorization: token });

        const usersDb = await db("classes").select(
          "classes.name",
          "classes.id",
        );
        expect(usersDb).toEqual(expClasses);
      });

      it("sends 200 OK when deleting a class successfully from the db", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/classes/2")
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Class deleted Successfully when deleting a class successfully from the db", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/classes/2")
          .set({ authorization: token });

        const dbClasses = await db("classes");

        expect(secondRes.body.message).toBe("Class deleted Successfully");
      });

      it("sends 406 client error when deleting a class that doesn't exist in db", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/classes/4")
          .set({ authorization: token });

        expect(secondRes.status).toBe(406);
      });

      it("sends error message 'Class with that id doesn't exist' when deleting a class that doesn't exist in db", async () => {
        await db("classes").insert({ name: "CS" });
        await db("classes").insert({ name: "Psy" });
        await db("classes").insert({ name: "Math" });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/classes/4")
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Class with that id doesn't exist");
      });
    });

    //delete student from user's student list
    describe("DELETE /users/students/:id", () => {
      it("deletes a student successfully from the db", async () => {
        await db("classes").insert({ name: "CS" });

        await db("students").insert({ name: "wolf", class_id: 1 });
        await db("students").insert({ name: "pup", class_id: 1 });
        await db("students").insert({ name: "dragon", class_id: 1 });

        const expStudents = [
          { name: "wolf", id: 1 },
          { name: "dragon", id: 3 },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        await supertest(server)
          .delete("/users/students/2")
          .set({ authorization: token });

        const usersDb = await db("students as s").select("s.name", "s.id");

        expect(usersDb).toEqual(expStudents);
      });

      it("sends 200 OK when deleting a student successfully from the db", async () => {
        await db("classes").insert({ name: "CS" });

        await db("students").insert({ name: "wolf", class_id: 1 });
        await db("students").insert({ name: "pup", class_id: 1 });
        await db("students").insert({ name: "dragon", class_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/users/students/2")
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends message 'Deleted student Successfully' when deleting a student successfully from the db", async () => {
        await db("classes").insert({ name: "CS" });

        await db("students").insert({ name: "wolf", class_id: 1 });
        await db("students").insert({ name: "pup", class_id: 1 });
        await db("students").insert({ name: "dragon", class_id: 1 });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/users/students/2")
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Deleted student Successfully");
      });

      it("sends 406 client error when deleting a student that's not in the db", async () => {
        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/users/students/2")
          .set({ authorization: token });

        expect(secondRes.status).toBe(406);
      });

      it("sends error message 'A student with that id doesn't exist' when deleting a student that's not in the db", async () => {
        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/users/students/2")
          .set({ authorization: token });

        expect(secondRes.body.message).toBe(
          "A student with that id doesn't exist",
        );
      });
    });

    //delete task from particular student
    describe("DELETE /students/:id/tasks/:tid", () => {
      it("deletes a student's task successfully from the db", async () => {
        await db("classes").insert({
          name: "CS",
        });

        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("students").insert({
          name: "pup",
          class_id: 1,
        });
        await db("students").insert({
          name: "dragon",
          class_id: 1,
        });

        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("tasks").insert({
          name: "to do2",
          due_date: "Sept 2, 2020",
        });
        await db("tasks").insert({
          name: "to do3",
          due_date: "Sept 3, 2020",
        });

        await db("student_tasks").insert({
          student_id: 1,
          task_id: 1,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 2,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 3,
        });

        const expStudents = [
          {
            name: "to do",
            due_date: "Sept 1, 2020",
          },
          {
            name: "to do3",
            due_date: "Sept 3, 2020",
          },
        ];

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/students/1/tasks/2")
          .set({ authorization: token });

        const usersDb = await db("tasks as t")
          .join("student_tasks as st", "st.task_id", "t.id")
          .join("students as s", "s.id", "st.student_id")
          .select("t.name", "t.due_date")
          .orderBy("t.id");

        expect(usersDb).toEqual(expStudents);
      });

      it("sends 200 OK when deleting a student's task successfully from the db", async () => {
        await db("classes").insert({
          name: "CS",
        });

        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("students").insert({
          name: "pup",
          class_id: 1,
        });
        await db("students").insert({
          name: "dragon",
          class_id: 1,
        });

        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("tasks").insert({
          name: "to do2",
          due_date: "Sept 2, 2020",
        });
        await db("tasks").insert({
          name: "to do3",
          due_date: "Sept 3, 2020",
        });

        await db("student_tasks").insert({
          student_id: 1,
          task_id: 1,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 2,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 3,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/students/1/tasks/2")
          .set({ authorization: token });

        expect(secondRes.status).toBe(200);
      });

      it("sends success message 'Deleted task Successfully' when deleting a student's task successfully from the db", async () => {
        await db("classes").insert({
          name: "CS",
        });

        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("students").insert({
          name: "pup",
          class_id: 1,
        });
        await db("students").insert({
          name: "dragon",
          class_id: 1,
        });

        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("tasks").insert({
          name: "to do2",
          due_date: "Sept 2, 2020",
        });
        await db("tasks").insert({
          name: "to do3",
          due_date: "Sept 3, 2020",
        });

        await db("student_tasks").insert({
          student_id: 1,
          task_id: 1,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 2,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 3,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/students/1/tasks/2")
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("Deleted task Successfully");
      });

      it("sends error message 'That task doesn't belong to that student' when deleting a task not in the student's task list", async () => {
        await db("classes").insert({
          name: "CS",
        });

        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("students").insert({
          name: "pup",
          class_id: 1,
        });
        await db("students").insert({
          name: "dragon",
          class_id: 1,
        });

        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("tasks").insert({
          name: "to do2",
          due_date: "Sept 2, 2020",
        });
        await db("tasks").insert({
          name: "to do3",
          due_date: "Sept 3, 2020",
        });

        await db("student_tasks").insert({
          student_id: 1,
          task_id: 1,
        });
        await db("student_tasks").insert({
          student_id: 2,
          task_id: 2,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 3,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/students/1/tasks/2")
          .set({ authorization: token });

        expect(secondRes.body.message).toBe(
          "That task doesn't belong to that student",
        );
      });

      it("sends error message 'That task does not exist' when deleting a task not in the db", async () => {
        await db("classes").insert({
          name: "CS",
        });

        await db("students").insert({
          name: "wolf",
          class_id: 1,
        });
        await db("students").insert({
          name: "pup",
          class_id: 1,
        });
        await db("students").insert({
          name: "dragon",
          class_id: 1,
        });

        await db("tasks").insert({
          name: "to do",
          due_date: "Sept 1, 2020",
        });
        await db("tasks").insert({
          name: "to do2",
          due_date: "Sept 2, 2020",
        });
        await db("tasks").insert({
          name: "to do3",
          due_date: "Sept 3, 2020",
        });

        await db("student_tasks").insert({
          student_id: 1,
          task_id: 1,
        });
        await db("student_tasks").insert({
          student_id: 2,
          task_id: 2,
        });
        await db("student_tasks").insert({
          student_id: 1,
          task_id: 3,
        });

        const firstRes = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
        });

        const token = firstRes.body.token;

        const secondRes = await supertest(server)
          .delete("/students/1/tasks/5")
          .set({ authorization: token });

        expect(secondRes.body.message).toBe("That task does not exist");
      });
    });
  });
});
