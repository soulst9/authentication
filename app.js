// middleware
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { auth } = require("./libraries/middleware/auth");

// sequelize model
const models = require("./models");

// router
const components = require("./components/v1/interface/components");
const UsersRouter = require("./components/v1/users");
const CertificationsRouter = require("./components/v1/certifications");

// error
const { sendSlack } = require("./libraries/helpers/logger");
const errorHandler = require("./libraries/error/handler");


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(auth);

models.sequelize.sync()   // {force: true} 옵션 사용 시 강제 삭제 후 생성하므로 주의
  .then(() => {

}).catch(err => {
  console.error(err);
  console.log('DB connection error. Please make sure DB is running.');
  process.exit();
});

components.push(new UsersRouter('/api/v1/users', app, models.User));
components.push(new CertificationsRouter('/api/v1/certifications', app, models.SelfCertification));

app.use(errorHandler);

// unhandled and uncaught error
process.on('unhandledRejection', (reason) => {
  console.log('unhandledRejection', (new Date()).toISOString(), reason);
  throw reason;
});
process.on('uncaughtException', (error) => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  console.log('unhandledRejection', (new Date()).toISOString());
  process.exit(1);
});

module.exports = app;
