import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import {HiOutlineTrash  } from "react-icons/hi";
import { MdModeEditOutline  } from "react-icons/md";

import "@xyflow/react/dist/style.css";
import TemplateNode from "./nodes/TemplateNode";
import QuickReplyNode from "./nodes/QuickReplyNode";
import CustomMessageNode from "./nodes/CustomMessageNode";
import LogicNode from "./nodes/LogicNode";
import { useDragDrop } from "../context/drag-drop";

const nodeTypes = {
  template: TemplateNode,
  quick: QuickReplyNode,
  custom: CustomMessageNode,
  logic: LogicNode,
};

const getId = () => `node_${+new Date()}`;

export const Workflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [savedFlows, setSavedFlows] = useState([]);
  const [activeFlowId, setActiveFlowId] = useState(null);
  const [flowName, setFlowName] = useState("");
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

      const res = await fetch(`http://localhost:5000/api/flows/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

    const workflow = {
      name: flowName || `Flow ${Date.now()}`,
      nodes,
      edges,
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
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
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
          text: dragData.text || "Editable text",
          options: dragData.options || ["Yes", "No"],
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
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    setActiveFlowId(flow.id);
    setFlowName(flow.name);
  };

  // Event listeners for nodes
  useEffect(() => {
    const handleDeleteNode = (e) => {
      const { nodeId } = e.detail;
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    };

    const handleTextUpdate = (e) => {
      const { nodeId, text } = e.detail;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, text } } : node
        )
      );
    };

    const handleOptionsUpdate = (e) => {
      const { nodeId, options } = e.detail;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, options: [...options] } } : node
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
        style={{ flex: 3, height: "100%", background: "#fff", borderRight: "1px solid #ddd" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>Saved Flows</h4>
          <button
            onClick={() => {
              setNodes([]);
              setEdges([]);
              setActiveFlowId(null);
              setFlowName("");
            }}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            + New Flow
          </button>
        </div>

        {savedFlows.length === 0 && <p>No saved flows yet</p>}
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
                <MdModeEditOutline/>
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
                <HiOutlineTrash/>
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          placeholder="Flow Name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          style={{
            width: "100%",
            padding: "6px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        />

        <button
          onClick={saveOrUpdateWorkflow}
          style={{
            padding: "8px 12px",
            background: activeFlowId ? "orange" : "green",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {activeFlowId ? "Update Flow" : "Save Flow"}
        </button>
      </div>
    </div>
  );
};
