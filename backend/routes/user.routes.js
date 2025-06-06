import express  from "express";

import { Register, Login } from "../controllers/user.controllers.js";

const userrouter = express.Router();
// User registration route
userrouter.post("/register", Register);

userrouter.post("/login", Login);

export default userrouter;