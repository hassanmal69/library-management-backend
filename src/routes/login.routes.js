import router from "express";
import login from "../controllers/login.controller.js";
const loginRouter = router();
loginRouter.post("/", login);
export default loginRouter;