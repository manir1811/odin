const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
// Require env file
require("dotenv").config();

const users = require("./routes/api/users");
const finance = require("./routes/api/finance/finance");

const app = express();

// Body Parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = process.env.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

// Passport setup
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.get("/", (req, res) => {
  res.send("Root page");
});

// Use Routes
app.use("/api/users", users);
app.use("/api/finance", finance);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
