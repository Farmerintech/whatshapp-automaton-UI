import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  MiniMap,
  Controls,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import { HiOutlineTrash } from "react-icons/hi";
import { MdModeEditOutline } from "react-icons/md";

import "@xyflow/react/dist/style.css";
import TemplateNode from "./nodes/TemplateNode";
import CustomMessageNode from "./nodes/CustomMessageNode";
import LogicNode from "./nodes/LogicNode";
import { useDragDrop } from "../context/drag-drop";
import OptionsNode from "./nodes/OptionsNode";
import QuickReplyNode from "./nodes/QuickReplyNode";

const nodeTypes = {
  template: TemplateNode,
  option: OptionsNode,
  quick: QuickReplyNode,
  custom: CustomMessageNode,
  logic: LogicNode,
};

const getId = () => `node_${+new Date()}`;

export const Workflow = ({
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  activeFlowId,
  setActiveFlowId,
  flowName,
  setFlowName,
}) => {
  const [savedFlows, setSavedFlows] = useState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [dragData] = useDragDrop();
  const reactFlowWrapper = useRef(null);

  const getUser = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const fetchFlows = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = getUser();
      if (!user) return;

      const res = await fetch(
        `http://localhost:5000/api/flows/user/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSavedFlows(data);
    } catch (err) {
      console.error("Failed to load flows:", err);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const saveOrUpdateWorkflow = async () => {
    const token = localStorage.getItem("token");
    const user = getUser();
    if (!user) {
      alert("You must be logged in to save flows");
      return;
    }

    // Normalize edges so source is always the "previous" node, target is "next"
    const normalizedEdges = edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (
        sourceNode &&
        targetNode &&
        sourceNode.position.y > targetNode.position.y
      ) {
        return { ...edge, source: edge.target, target: edge.source };
      }
      return edge;
    });

    // Clean nodes before saving: remove options from custom/quick, strip Editable text from logic
    const cleanedNodes = nodes.map((node) => {
      let newData = { ...node.data };

      if (node.type === "logic") {
        delete newData.text; // logic nodes shouldn't have text
      }

      if (node.type === "custom" || node.type === "quick") {
        delete newData.options; // remove options
      }

      return { ...node, data: newData };
    });

    const workflow = {
      name: flowName || `Flow ${Date.now()}`,
      nodes: cleanedNodes,
      edges: normalizedEdges,
      userId: user.id,
    };

    try {
      let url = `http://localhost:5000/api/flows`;
      let method = "POST";

      if (activeFlowId) {
        url = `http://localhost:5000/api/flows/${activeFlowId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workflow),
      });

      if (!res.ok) throw new Error(`Failed to save workflow: ${res.status}`);

      await res.json();
      alert(activeFlowId ? "Workflow updated!" : "Workflow saved!");
      fetchFlows();
      if (!activeFlowId) {
        setActiveFlowId(null);
        setFlowName("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save workflow");
    }
  };

  const deleteFlow = async (flowId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/flows/${flowId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete flow");

      alert("Flow deleted");
      fetchFlows();
      if (flowId === activeFlowId) {
        setNodes([]);
        setEdges([]);
        setActiveFlowId(null);
        setFlowName("");
      }
    } catch (err) {
      console.error("Error deleting flow:", err);
    }
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));

      // Automatically label custom nodes when connected to logic nodes
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (sourceNode?.type === "logic" && targetNode?.type === "custom") {
        const label =
          params.sourceHandle === "true-branch" ? "Yes" : "No";

        setNodes((nds) =>
          nds.map((node) =>
            node.id === targetNode.id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    label, // override label dynamically
                  },
                }
              : node
          )
        );
      }
    },
    [nodes]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!dragData) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: getId(),
        type: dragData.type || "template",
        position,
        data: {
          ...dragData,
          // Only template & custom nodes get editable text by default
          text:
            dragData.type !== "logic"
              ? dragData.text || "Editable text"
              : undefined,
          // Only options node and logic node get options by default
          options:
            dragData.type === "option" || dragData.type === "logic"
              ? dragData.options || ["Yes", "No"]
              : undefined,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, dragData]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const loadFlow = (flow) => {
    // Clean old flows (remove Editable text, strip options where needed)
    const cleanedNodes = (flow.nodes || []).map((node) => {
      let newData = { ...node.data };

      if (node.type === "logic") {
        delete newData.text;
      }

      if (node.type === "custom" || node.type === "quick") {
        delete newData.options;
      }

      return { ...node, data: newData };
    });

    setNodes(cleanedNodes);
    setEdges(flow.edges || []);
    setActiveFlowId(flow.id);
    setFlowName(flow.name);
  };

  // Event listeners for nodes
  useEffect(() => {
    const handleDeleteNode = (e) => {
      const { nodeId } = e.detail;
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    };

    const handleTextUpdate = (e) => {
      const { nodeId, text } = e.detail;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, text } }
            : node
        )
      );
    };

    const handleOptionsUpdate = (e) => {
      const { nodeId, options } = e.detail;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, options: [...options] } }
            : node
        )
      );
    };

    window.addEventListener("delete-node", handleDeleteNode);
    window.addEventListener("update-node-text", handleTextUpdate);
    window.addEventListener("update-node-options", handleOptionsUpdate);

    return () => {
      window.removeEventListener("delete-node", handleDeleteNode);
      window.removeEventListener("update-node-text", handleTextUpdate);
      window.removeEventListener("update-node-options", handleOptionsUpdate);
    };
  }, [setNodes, setEdges]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div
        ref={reactFlowWrapper}
        style={{
          flex: 3,
          height: "100%",
          background: "#fff",
          borderRight: "1px solid #ddd",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeClick={(event, edge) => {
            event.stopPropagation();
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
          }}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>

      <div
        style={{
          flex: 1,
          height: "100%",
          background: "#f9f9f9",
          padding: "10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Saved Flows</h4>
        </div>

        {savedFlows.length === 0 && <p>No saved chat agent</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {savedFlows.map((flow) => (
            <li
              key={flow.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                padding: "6px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <span
                style={{ flex: 1, cursor: "pointer" }}
                onClick={() => loadFlow(flow)}
              >
                {flow.name}
              </span>
              <button
                onClick={() => loadFlow(flow)}
                style={{
                  background: "orange",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 6px",
                  cursor: "pointer",
                  marginRight: "4px",
                }}
              >
                <MdModeEditOutline />
              </button>
              <button
                onClick={() => deleteFlow(flow.id)}
                style={{
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 6px",
                  cursor: "pointer",
                }}
              >
                <HiOutlineTrash />
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          placeholder="Chat agent name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          style={{
            width: "100%",
            padding: "6px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
          className="border border-gray-500 rounded-[8px] outline-none hover:border-gray-700"
        />

        <button
          onClick={saveOrUpdateWorkflow}
          className={`${
            !activeFlowId ? "bg-green-600" : "bg-orange-500"
          } w-full px-[12px] py-[8px] text-white border-none pointer outline-none rounded-[8px]`}
        >
          {activeFlowId ? "Update agent" : "Save agent"}
        </button>
      </div>
    </div>
  );
};
