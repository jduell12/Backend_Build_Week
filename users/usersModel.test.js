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
    it.todo("");
  });
});
