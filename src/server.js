import app from "./app.js";
import './config/sequelize.config.js'
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});