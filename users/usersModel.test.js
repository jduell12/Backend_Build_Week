const db = require("../data/dbConfig");
const Users = require("./usersModel");

describe("usersModel", () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("getUsers()", () => {
    it("gets an empty array of users from empty db", async () => {
      const users = await Users.getUsers();
      expect(users).toHaveLength(0);
    });
    it("gets array of users from non-empty db", async () => {
      await db("users").insert({ username: "wolf", password: "pass" });
      await db("users").insert({ username: "kelly", password: "pass" });
      await db("users").insert({ username: "dragon", password: "pass" });

      const users = await Users.getUsers();
      expect(users).toHaveLength(3);
    });
  });

  describe("addUser(user)", () => {
    it("adds a user to an empty database", async () => {
      await Users.addUser({ username: "wolf", password: "pass" });
      const users = await db("users");
      expect(users).toHaveLength(1);
    });
    it("adds a user to a non-empty database", async () => {
      await db("users").insert({ username: "wolf", password: "pass" });
      await db("users").insert({ username: "dragon", password: "pass" });
      await Users.addUser({ username: "penguin", password: "pass" });
      const users = await db("users");
      expect(users).toHaveLength(3);
    });
  });

  describe("editUser(id, user)", () => {
    it("edits a user in the database", async () => {
      await db("users").insert({ username: "wolf", password: "pass" });

      const count = await Users.editUser(1, { username: "awolf" });

      expect(count).toBe(1);

      const users = await db("users");
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual({
        id: 1,
        class_id: null,
        username: "awolf",
        password: "pass",
      });
    });

    it("returns 0 when edit fails due to wrong id", async () => {
      const count = await Users.editUser(1, { username: "wolf" });

      expect(count).toBe(0);
    });
  });

  describe("deleteUser(id)", () => {
    it("returns 1 when successfully deletes user from db", async () => {
      await db("users").insert({ username: "wolf", password: "pass" });
      const count = await Users.deleteUser(1);
      expect(count).toBe(1);
    });
    it("returns 0 when no user with the id is in the db", async () => {
      const count = await Users.deleteUser(1);
      expect(count).toBe(0);
    });
  });

  describe("getUserById(id)", () => {
    it("returns user information correctly", async () => {
      await db("users").insert({ username: "wolf", password: "pass" });

      const user = await Users.getUserById(1);

      expect(user).not.toBeNull();
      expect(user).toEqual({
        class_id: null,
        id: 1,
        username: "wolf",
        password: "pass",
      });
    });

    it("returns undefined when no user with that id is in the db", async () => {
      const user = await Users.getUserById(1);
      expect(user).toBeUndefined();
    });
  });

  describe("getUserByUsername(filter)", () => {
    it("gets user by username", async () => {
      const user1 = {
        username: "wolf",
        password: "kelly",
      };

      const expected = {
        username: "wolf",
        password: "kelly",
        id: 1,
        class_id: null,
      };

      await db("users").insert(user1);
      const user = await Users.getUserByUsername("wolf");

      expect(user).not.toBeNull();
      expect(user).toEqual(expected);
    });

    it("returns undefined when the username is not in the db", async () => {
      const user = await Users.getUserByUsername("wolf");

      expect(user).toBeUndefined();
    });
  });

  describe("getStudents(id)", () => {
    it.todo("");
    it.todo("");
  });

  describe("getClasses(id)", () => {
    it.todo("");
    it.todo("");
  });
});
