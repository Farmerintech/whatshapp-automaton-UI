import express from "express";
import {createFlow, getUserFlows, getFlowById, updateFlow, deleteFlow } from "../controllers/flowController.js";
import { runFlow } from "../controllers/flowRunnerController.js";
const FlowrRouter = express.Router();

FlowrRouter.post("/", createFlow);             // Create a new flow
FlowrRouter.get("/user/:userId", getUserFlows); // Get all flows by user
FlowrRouter.get("/:flowId", getFlowById);       // Get a single flow
FlowrRouter.put("/:flowId", updateFlow);        // Update flow
FlowrRouter.delete("/:flowId", deleteFlow);     // Delete flow
FlowrRouter.post("/:flowId/run", runFlow);

export default FlowrRouter;
