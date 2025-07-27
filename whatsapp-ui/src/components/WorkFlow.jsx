import React, { useCallback, useRef, useEffect } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TemplateNode from "./nodes/TemplateNode";
import QuickReplyNode from "./nodes/QuickReplyNode";
import CustomMessageNode from "./nodes/CustomMessageNode";
import { useDragDrop } from "../context/drag-drop";
import LogicNode from "./nodes/LogicNode";

const nodeTypes = {
  template: TemplateNode,
  quick: QuickReplyNode,
  custom: CustomMessageNode,
  logic: LogicNode
};

const getId = () => `node_${+new Date()}`;

export const Workflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [dragData] = useDragDrop();
  const reactFlowWrapper = useRef(null);

  // Utility to log/export workflow
  const exportWorkflow = (customNodes = nodes, customEdges = edges) => {
    const workflow = { nodes: customNodes, edges: customEdges };
    console.log("----- SAVED WORKFLOW JSON -----");
    console.log(JSON.stringify(workflow, null, 2));
    console.log("--------------------------------");
    return workflow;
  };

  const logCurrentState = (updatedNodes = nodes, updatedEdges = edges) => {
    console.log("----- CURRENT WORKFLOW STATE -----");
    console.log("Nodes:", updatedNodes);
    console.log("Edges:", updatedEdges);
    console.log("----------------------------------");
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updated = addEdge({ ...params, animated: true }, eds);
        console.log("Edge created:", params);
        logCurrentState(nodes, updated);
        return updated;
      });
    },
    [nodes]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!dragData) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: dragData.type || "template",
        position,
        data: dragData,
      };

      setNodes((nds) => {
        const updated = nds.concat(newNode);
        console.log("Node added:", newNode);
        logCurrentState(updated, edges);
        return updated;
      });
    },
    [screenToFlowPosition, dragData, edges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodesDelete = useCallback(
    (deleted) => {
      console.log("Deleted nodes:", deleted);
      const remaining = nodes.filter((n) => !deleted.includes(n));
      logCurrentState(remaining, edges);
    },
    [nodes, edges]
  );

  const onEdgesDelete = useCallback(
    (deleted) => {
      console.log("Deleted edges:", deleted);
      const remaining = edges.filter((e) => !deleted.includes(e));
      logCurrentState(nodes, remaining);
    },
    [nodes, edges]
  );

  // Listen for custom "delete-node" event triggered by node "×" buttons
  useEffect(() => {
    const handleDeleteNode = (e) => {
      const { nodeId } = e.detail;
      setNodes((nds) => {
        const updated = nds.filter((node) => node.id !== nodeId);
        console.log("Node deleted via button:", nodeId);
        logCurrentState(updated, edges);
        return updated;
      });
    };

    window.addEventListener("delete-node", handleDeleteNode);
    return () => {
      window.removeEventListener("delete-node", handleDeleteNode);
    };
  }, [edges, setNodes]);

  // Generate JSON preview live
  const workflowJSON = JSON.stringify({ nodes, edges }, null, 2);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* Flow Canvas */}
      <div
        ref={reactFlowWrapper}
        style={{
          flex: 3, // 75% width
          height: "100%",
          background: "#fff",
          borderRight: "1px solid #ddd",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes);
            logCurrentState(nodes, edges);
          }}
          onEdgesChange={(changes) => {
            onEdgesChange(changes);
            logCurrentState(nodes, edges);
          }}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: "100%", height: "100%" }}
        >
          <MiniMap />
          <Controls />
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>

      {/* JSON Preview + Save Button */}
      <div
        style={{
          flex: 1, // 25% width
          height: "100%",
          background: "#f9f9f9",
          padding: "10px",
          fontFamily: "monospace",
          fontSize: "12px",
          overflowY: "auto",
        }}
      >
        <h4 style={{ marginBottom: "10px" }}>Workflow JSON (Live)</h4>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            maxHeight: "80%",
          }}
        >
          {workflowJSON}
        </pre>
        <button
          onClick={() => exportWorkflow()}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save Workflow (Log JSON)
        </button>
      </div>
    </div>
  );
};
