"use strict";
const express = require("express");
const http = require("http");
const userRouter = require("./router/userRoute");
const teamRouter = require("./router/teamRoute");
const recordRouter = require("./router/recordRoute");

const fs = require("fs");

// const router = express.Router();

const app = express(); // start new express application

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "alive" }));
app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use("/record", recordRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
