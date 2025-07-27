import express from "express";
import dotenv from "dotenv";
import sequelize from "./db.js";
import flowRoutes from "./routes/flowRoutes.js";
import User from "./models/User.js";
import Flow from "./models/Flow.js";

dotenv.config();
const app = express();
app.use(express.json());

// Sync database (creates tables if not exist)
sequelize.sync().then(() => console.log("Database synced"));

// Routes
app.use("/flows", flowRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
