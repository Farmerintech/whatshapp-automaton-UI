import Flow from "../model/FlowModel.js";
import { getNextNode } from "../services/flowRunnerServices.js";

export const runFlow = async (req, res) => {
  const { flowId } = req.params;
  const { userId, message } = req.body;

  try {
    const flow = await Flow.findByPk(flowId);
    if (!flow) return res.status(404).json({ error: "Flow not found" });

    const flowData = flow.toJSON();

    // Parse only if they're strings
    flowData.nodes = typeof flowData.nodes === "string" ? JSON.parse(flowData.nodes) : (flowData.nodes || []);
    flowData.edges = typeof flowData.edges === "string" ? JSON.parse(flowData.edges) : (flowData.edges || []);

    const reply = getNextNode(flowData, userId, message);
    res.json({ reply });
  } catch (err) {
    console.error("Flow Runner Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
