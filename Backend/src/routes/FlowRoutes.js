import express from "express";
import {
  createFlow,
  getUserFlows,
  getFlowById,
  updateFlow,
  deleteFlow,
} from "../controllers/flowController.js";

const router = express.Router();

router.post("/", createFlow);             // Create a new flow
router.get("/user/:userId", getUserFlows); // Get all flows by user
router.get("/:flowId", getFlowById);       // Get a single flow
router.put("/:flowId", updateFlow);        // Update flow
router.delete("/:flowId", deleteFlow);     // Delete flow

export default router;
