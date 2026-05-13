import express from "express";
import cors from "cors";
const app = express();
import loginRouter from './routes/login.routes.js'

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use("/api/v1/auth/login", loginRouter);
export default app;