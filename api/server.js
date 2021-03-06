const express = require("express");
const cors = require("cors");
const server = express();

const authenticate = require("../auth/authenticate-middleware");
const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/usersRouter");
const classesRouter = require("../classes/classesRouter");
const studentsRouter = require("../students/studentsRouter");
const dummyRouter = require("../dummyData/dummyRouter");

server.use(express.json());
server.use(cors());

server.use("/auth", authRouter);
server.use("/users", authenticate, usersRouter);
server.use("/classes", authenticate, classesRouter);
server.use("/students", authenticate, studentsRouter);
server.use("/dummy", dummyRouter);

server.get("/", (req, res) => {
  res.status(200).json({ server: "working" });
});

module.exports = server;
