let sessionState = {}; // userId -> { currentNodeId }

export function getNextNode(flow, userId, message) {
  const { nodes, edges } = flow;

  const getStartNode = () => {
    const targetIds = edges.map(e => e.target);
    return nodes.find(n => !targetIds.includes(n.id)) || nodes[0];
  };

  // Start new session if user has no state
  if (!sessionState[userId]) {
    const startNode = getStartNode();
    sessionState[userId] = { currentNodeId: startNode.id };
    return startNode.data?.text || startNode.data?.label || "Starting...";
  }

  const { currentNodeId } = sessionState[userId];
  const currentNode = nodes.find(n => n.id === currentNodeId);
  const outgoingEdges = edges.filter(e => e.source === currentNodeId);

  // If there are no outgoing edges, flow ends
  if (!outgoingEdges.length) {
    delete sessionState[userId];
    return "End of flow.";
  }

  let nextNodeId;

  // Handle logic branching nodes
  if (currentNode.type === "logic" && currentNode.data?.condition) {
    const trueEdge = outgoingEdges.find(e => e.sourceHandle === "true-branch");
    const falseEdge = outgoingEdges.find(e => e.sourceHandle === "false-branch");

    const isTrue = eval(currentNode.data.condition.replace("reply", `"${message}"`));
    nextNodeId = isTrue ? trueEdge?.target : falseEdge?.target;
  } else {
    // Default: just go to the first connected node
    nextNodeId = outgoingEdges[0]?.target;
  }

  const nextNode = nodes.find(n => n.id === nextNodeId);

  if (!nextNode) {
    delete sessionState[userId];
    return "End of flow.";
  }

  // Update session to this new node
  sessionState[userId].currentNodeId = nextNode.id;

  return nextNode.data?.text || nextNode.data?.label || "No content.";
}
