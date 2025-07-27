import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DB from "./config/db.js";
import FlowRouter from "./routes/FlowRoutes.js";
import AuthRouter from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
DB.sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB Error:", err));

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/flows", FlowRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
