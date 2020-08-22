const db = require("../data/dbConfig");
const Students = require("./studentsModel");

describe("studentsModel", () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    await db("students").truncate();
    await db("classes").truncate();
    await db("tasks").truncate();
  });
});
