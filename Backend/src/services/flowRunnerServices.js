// flow-runner.js

function parseFlow(flow) {
  return {
    nodes: typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes || [],
    edges: typeof flow.edges === 'string' ? JSON.parse(flow.edges) : flow.edges || [],
  };
}

const userStates = {}; // In-memory tracking of users' current positions

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

  // Default to ["yes", "no"] if options are not defined
  const options = (node.data?.options?.length ? node.data.options : ["Yes", "No"]).map(opt => opt.toLowerCase());

  if (!options.includes(normalizedMsg)) {
    return null;
  }

  // Route: 'yes' => true-branch, 'no' => false-branch
  let handle;
  if (normalizedMsg === 'yes') {
    handle = 'true-branch';
  } else if (normalizedMsg === 'no') {
    handle = 'false-branch';
  } else {
    // Optionally support future branches
    handle = `option-${normalizedMsg}`;
  }

  const matchedEdge = edges.find(
    (edge) => edge.source === node.id && edge.sourceHandle === handle
  );

  return matchedEdge?.target || null;
}

function processMessage(flowData, userId, incomingMessage) {
  const { nodes, edges } = parseFlow(flowData);

  let currentNodeId = userStates[userId] || nodes[0]?.id;
  const currentNode = getNodeById(nodes, currentNodeId);
  if (!currentNode) return 'Flow not found.';

  let response = '';

  if (['template', 'custom'].includes(currentNode.type)) {
    response = currentNode.data.text;

    const next = getNextNodes(edges, currentNode.id);
    if (next.length > 0) {
      userStates[userId] = next[0].target;
    } else {
      userStates[userId] = null;
    }
    return response;
  }

  if (currentNode.type === 'logic') {
    const nextId = evaluateLogicNode(currentNode, incomingMessage, edges);

    if (!nextId) {
      const options = currentNode.data.options?.length
        ? currentNode.data.options.join(', ')
        : 'Yes, No';
      return `Invalid response. Please reply with one of: ${options}`;
    }

    const nextNode = getNodeById(nodes, nextId);
    userStates[userId] = nextId;

    return nextNode?.data?.text || 'Next node has no message.';
  }

  return 'Unknown node type or flow ended.';
}

export default processMessage;
