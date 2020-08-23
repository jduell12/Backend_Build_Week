const express = require("express");
const cors = require("cors");
const server = express();

const authenticate = require("../auth/authenticate-middleware");
const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/usersRouter");

server.use(express.json());
server.use(cors());

server.use("/auth", authRouter);
server.use("/users", authenticate, usersRouter);

server.get("/", (req, res) => {
  res.status(200).json({ server: "working" });
});

module.exports = server;
