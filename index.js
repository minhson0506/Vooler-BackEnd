const express = require("express");
const http = require("http");
const { getUserByUsername } = require("./fetch/models");

// Test only
const testUser = "Jerry";
const testData = getUserByUsername(testUser);

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(`Hello World, ${testData}`);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
