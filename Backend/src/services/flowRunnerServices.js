function parseFlow(flow) {
  return {
    nodes: typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes || [],
    edges: typeof flow.edges === 'string' ? JSON.parse(flow.edges) : flow.edges || [],
  };
}

const userStates = {}; // In-memory user flow tracking

function getNodeById(nodes, id) {
  return nodes.find((node) => node.id === id);
}

function getNextNodes(edges, currentNodeId) {
  return edges
    .filter((edge) => edge.source === currentNodeId)
    .map((edge) => ({
      target: edge.target,
      sourceHandle: edge.sourceHandle,
    }));
}

function evaluateLogicNode(node, userMessage, edges) {
  const normalizedMsg = userMessage.trim().toLowerCase();
  const options = (node.data?.options?.length ? node.data.options : ["Yes", "No"]).map(opt => opt.toLowerCase());

  if (!options.includes(normalizedMsg)) {
    return null;
  }

  const handle = normalizedMsg === 'yes' || normalizedMsg === 'no'
    ? `${normalizedMsg === 'yes' ? 'true' : 'false'}-branch`
    : `option-${normalizedMsg}`;

  const matchedEdge = edges.find(
    (edge) => edge.source === node.id && edge.sourceHandle === handle
  );

  return matchedEdge?.target || null;
}

function evaluateConditionLogicNode(node, userMessage, edges) {
  const reply = userMessage.trim().toLowerCase();
  const conditions = node.data?.conditions || [];
  const defaultBranch = node.data?.defaultBranch || null;

  const matchedCondition = conditions.find(
    (cond) => cond.value?.toLowerCase() === reply
  );

  const matchedBranch = matchedCondition?.branch || defaultBranch;

  if (!matchedBranch) return null;

  const matchedEdge = edges.find(
    (edge) => edge.source === node.id && edge.sourceHandle === matchedBranch
  );

  return matchedEdge?.target || null;
}

function processMessage(flowData, userId, incomingMessage) {
  const { nodes, edges } = parseFlow(flowData);

  // Reset on "hi"
  if (incomingMessage.trim().toLowerCase() === 'hi') {
    userStates[userId] = nodes[0]?.id;
    return processMessage(flowData, userId, '');
  }

  let currentNodeId = userStates[userId] || nodes[0]?.id;
  const currentNode = getNodeById(nodes, currentNodeId);
  if (!currentNode) return 'Flow not found.';

  let response = '';

  if (['template', 'custom'].includes(currentNode.type)) {
    response = currentNode.data.text;

    let next = getNextNodes(edges, currentNode.id);
    if (next.length === 0) {
      // No more nodes → flow ends here
      userStates[userId] = null;
      return `${response}\n\n✅ End of conversation. Type "hi" to restart.`;
    }

    // Traverse auto-forwarding nodes
    while (next.length > 0) {
      const nextNode = getNodeById(nodes, next[0].target);
      if (!nextNode) break;

      userStates[userId] = nextNode.id;

      if (['template', 'custom'].includes(nextNode.type)) {
        response += '\n' + nextNode.data.text;
        next = getNextNodes(edges, nextNode.id);

        // If next has no edges, end flow
        if (next.length === 0) {
          userStates[userId] = null;
          return `${response}\n\n✅ End of conversation. Type "hi" to restart.`;
        }

        continue;
      }

      break;
    }

    return response;
  }

  // Handle logic node
  if (currentNode.type === 'logic') {
    const nextId = evaluateLogicNode(currentNode, incomingMessage, edges);
    if (!nextId) {
      const options = currentNode.data.options?.join(', ') || 'Yes, No';
      return `Invalid response. Please reply with one of: ${options}`;
    }

    userStates[userId] = nextId;
    return processMessage(flowData, userId, '');
  }

  // Handle condition node
  if (currentNode.type === 'condition') {
    const nextId = evaluateConditionLogicNode(currentNode, incomingMessage, edges);
    if (!nextId) {
      const valid = currentNode.data?.conditions?.map(c => c.value).filter(Boolean).join(', ') || 'valid input';
      return `Invalid input. Please respond with one of: ${valid}`;
    }

    userStates[userId] = nextId;
    return processMessage(flowData, userId, '');
  }

  // Fallback
  userStates[userId] = null;
  return '✅ End of conversation. Type "hi" to restart.';
}
export default processMessage;
