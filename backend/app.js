require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("./models/connection");

const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");

app.use(
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/Coconut/users", usersRouter);
app.use("/Coconut/posts", postsRouter);

module.exports = app;
