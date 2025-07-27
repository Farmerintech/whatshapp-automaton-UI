import express from "express";
import dotenv from "dotenv";
import FlowrRouter from "./routes/FlowRoutes.js";
import DB from "./config/db.js";


dotenv.config();
const app = express();
app.use(express.json());

// Sync database (creates tables if not exist)
DB.sync().then(() => console.log("Database synced"));

// Routes
app.use("/flows", FlowrRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
