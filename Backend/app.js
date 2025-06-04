const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors")
const {limiter,aiLimiter} = require("./utils/rateLimit")
const morgan = require("morgan")
require("dotenv").config();

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const walletRoute = require("./routes/walletRoute");
const transactionRoute = require("./routes/transactionRoute");
const emailRoute = require("./routes/emailRoutes");
const aiRoute = require("./routes/AIRoutes")
const agentRoute = require("./routes/agentRoutes")

//middleware
app.use(morgan('combined'))
app.use(limiter)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true,
  })
);
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
app.use(express.static("public"));

// Konfigurasi Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "http://localhost:8000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken,refreshToken });
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
app.use("/api/AI",aiRoute)
app.use("/api/agent", agentRoute)

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen("3000",'0.0.0.0', () => {
  console.log("Server is listening on port 3000");
});
