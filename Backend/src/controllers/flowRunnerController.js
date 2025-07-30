import Flow from "../model/FlowModel.js";
import processMessage from "../services/flowRunnerServices.js";

export const runFlow = async (req, res) => {
  const { flowId } = req.params;
  const { userId, message } = req.body;

  try {
    const flow = await Flow.findByPk(flowId);
    if (!flow) {
      return res.status(404).json({ error: "Flow not found" });
    }

    const flowData = flow.toJSON();
    const reply = processMessage(flowData, userId, message);

    res.json({ reply });
  } catch (err) {
    console.error("Flow Runner Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
