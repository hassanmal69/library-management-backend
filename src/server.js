import app from "./app.js";
import db from "./models/index.js";

const PORT = 4000;

async function startServer() {
  try {
    // Test the database connection using the same instance that models use
    await db.sequelize.authenticate();
    console.log("✅ Connected to MySQL successfully!");

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

startServer();