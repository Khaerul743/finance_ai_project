const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const walletRoute = require("./routes/walletRoute");
const transactionRoute = require("./routes/transactionRoute");
const emailRoute = require("./routes/emailRoutes");

//middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Konfigurasi Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use("/api/auth", authRoute);
app.use("/api", userRoute);
app.use("/api", walletRoute);
app.use("/api", transactionRoute);
app.use("/api", emailRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen("3000", () => {
  console.log("Server is listening on port 3000");
});
