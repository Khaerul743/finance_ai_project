const express = require("express");
const app = express();
const { User } = require("./models/user");

app.get("/", (req, res) => {
  res.send("Hello World");
  User.create({
    name: "Khaerul",
    email: "Khaerul@gmail.com",
    password: "12345678",
  });
});

app.listen("3000", () => {
  console.log("Server is listening on port 3000");
});
