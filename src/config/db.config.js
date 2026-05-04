import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  development: {
    username: process.env.CONFIG_USER || "root",
    password: process.env.CONFIG_PASSWORD || "",
    database: process.env.CONFIG_DATABASE || "library_db",
    host: process.env.CONFIG_HOST || "localhost",
    port: process.env.CONFIG_PORT || 3310,
    dialect: "mysql",
  },

  test: {
    username: process.env.CONFIG_USER || "root",
    password: process.env.CONFIG_PASSWORD || "",
    database: process.env.CONFIG_DATABASE || "library_db_test",
    host: process.env.CONFIG_HOST || "localhost",
    port: process.env.CONFIG_PORT || 3310,
    dialect: "mysql",
  },

  production: {
    username: process.env.CONFIG_USER || "root",
    password: process.env.CONFIG_PASSWORD || "",
    database: process.env.CONFIG_DATABASE || "library_db_prod",
    host: process.env.CONFIG_HOST || "localhost",
    port: process.env.CONFIG_PORT || 3310,
    dialect: "mysql",
  },
};

export default dbConfig;