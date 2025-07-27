import express from "express";
import { register, login } from "../controllers/auth.js";

const AuthRouter = express.Router();

// Register & Login routes
AuthRouter.post("/register", register);
AuthRouter.post("/login", login);

export default AuthRouter;
