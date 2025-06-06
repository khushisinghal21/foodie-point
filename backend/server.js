import express  from "express";
import cors from "cors";

import 'dotenv/config'
import connectDB from "./config/db.js";
import userrouter from "./routes/user.routes.js";
connectDB()
const app = express();
const port= process.env.PORT || 5000;
app.use(express.json());

app.use(cors({
  origin: true, // or '*'
  credentials: true
}));


app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userrouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
