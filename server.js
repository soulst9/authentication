"use strict";

const app = require("./app");
const http = require("http");
const normalizePort = require("normalize-port");
const server = require("./config/server");

const port = normalizePort(process.env.PORT || server.api.port);
app.set("port", port);

// const server = http.createServer(app).listen(port, () => {
http.createServer(app).listen(port, () => {
  console.log(`listening on ${port}`);
});
