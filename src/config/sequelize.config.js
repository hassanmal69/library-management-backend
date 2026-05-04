import { Sequelize } from "sequelize";
import dbConfig from "./db.config.js";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
    },
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL successfully!");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};

testConnection();

export default sequelize;

