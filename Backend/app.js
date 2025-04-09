const express = require("express");
const app = express();
const { User } = require("./models/user");

const authRoute = require("./routes/authRoute");
const walletRoute = require("./routes/walletRoute");
const transactionRoute = require("./routes/transactionRoute");

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api", walletRoute);
app.use("/api", transactionRoute);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen("3000", () => {
  console.log("Server is listening on port 3000");
});
