const express = require("express");

const server = express();

//add auth middleware to routers

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ server: "working" });
});

module.exports = server;
