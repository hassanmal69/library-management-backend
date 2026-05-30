import express from "express";
import cors from "cors";
const app = express();
import loginRouter from './routes/login.routes.js'
import bookRoutes from './routes/book.routes.js'

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use("/api/v1/auth/login", loginRouter);
app.use("/api/v1/books", bookRoutes)
app.get('/', (req, res) => {
  res.send('Server is running');
});
export default app;