const env = process.env.NODE_ENV || "dev";
const dev = {
  api: {
    port: 8000,
  },
  db: {
    username: "auth_user",
    password: "qwe123!@#",
    database: "auth",
    host: "127.0.0.1",
    port: "63306",
    dialect: "mysql",
    use_env_variable: "DATABASE_URL",
  },
};

const test = {
  app: {
    port: 7000,
  },
  db: {
    host: "10.103.208.3",
    port: 3306,
    user: "rcsacessuser",
    pw: "!lion0416",
    database: "authDB",
  },
};

const config = {
  dev,
  test,
};

module.exports = config[env];
