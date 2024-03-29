"use strict";
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const passport = require("./utils/passport");
const userRouter = require("./router/userRoute");
const teamRouter = require("./router/teamRoute");
const recordRouter = require("./router/recordRoute");
const authRouter = require("./router/authRoute");
const fs = require("fs");

// process.env.NODE_ENV = "production";

const app = express(); // start new express application

app.use(cors());
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "alive" }));
app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/team", teamRouter);
app.use(
  "/record",
  passport.authenticate("jwt", { session: false }),
  recordRouter
);
app.use("/auth", authRouter);

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
