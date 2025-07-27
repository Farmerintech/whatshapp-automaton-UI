import Flow from "../model/FlowModel.js";
import User from "../model/UserModel.js";

// Create a new flow
export const createFlow = async (req, res) => {
  try {
    const { name, userId, nodes, edges } = req.body;

    const flow = await Flow.create({ name, userId, nodes, edges });
    res.status(201).json(flow);
  } catch (error) {
    res.status(500).json({ message: "Failed to create flow", error: error.message });
  }
};

// Get all flows for a user
export const getUserFlows = async (req, res) => {
  try {
    const { userId } = req.params;
    const flows = await Flow.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(flows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch flows", error: error.message });
  }
};

// Get a single flow by ID
export const getFlowById = async (req, res) => {
  try {
    const { flowId } = req.params;
    const flow = await Flow.findByPk(flowId, {
      include: [{ model: User, attributes: ["username", "email"] }],
    });
    if (!flow) return res.status(404).json({ message: "Flow not found" });
    res.status(200).json(flow);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch flow", error: error.message });
  }
};

// Update a flow
export const updateFlow = async (req, res) => {
  try {
    const { flowId } = req.params;
    const { name, nodes, edges, isActive } = req.body;

    const flow = await Flow.findByPk(flowId);
    if (!flow) return res.status(404).json({ message: "Flow not found" });

    flow.name = name ?? flow.name;
    flow.nodes = nodes ?? flow.nodes;
    flow.edges = edges ?? flow.edges;
    flow.isActive = isActive ?? flow.isActive;

    await flow.save();
    res.status(200).json(flow);
  } catch (error) {
    res.status(500).json({ message: "Failed to update flow", error: error.message });
  }
};

// Delete a flow
export const deleteFlow = async (req, res) => {
  try {
    const { flowId } = req.params;
    const flow = await Flow.findByPk(flowId);
    if (!flow) return res.status(404).json({ message: "Flow not found" });

    await flow.destroy();
    res.status(200).json({ message: "Flow deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete flow", error: error.message });
  }
};
