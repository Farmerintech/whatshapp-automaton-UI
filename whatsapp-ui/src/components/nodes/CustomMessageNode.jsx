import React from "react";
import { Handle, Position } from "@xyflow/react";

const CustomMessageNode = ({ id, data }) => {
  const handleChange = (e) => {
    const newText = e.target.value;

    const updateEvent = new CustomEvent("update-node-text", {
      detail: { nodeId: id, text: newText },
    });
    window.dispatchEvent(updateEvent);
  };

  const deleteNode = () => {
    const event = new CustomEvent("delete-node", { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      style={{
        background: "#e2d4f0",
        border: "1px solid #b8a9d9",
        borderRadius: "6px",
        padding: "10px",
        width: "220px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Delete Button */}
      <button
        onClick={deleteNode}
        style={{
          position: "absolute",
          top: "2px",
          right: "2px",
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          cursor: "pointer",
          fontSize: "12px",
          lineHeight: "16px",
        }}
      >
        ×
      </button>

      {/* Editable Message */}
      <textarea
        style={{
          width: "100%",
          minHeight: "40px",
          border: "1px solid #b8a9d9",
          borderRadius: "4px",
          padding: "4px",
          resize: "none",
          fontFamily: "Arial, sans-serif",
        }}
        value={data.text || ""}  // Controlled by Workflow
        onChange={handleChange}
        placeholder="Type your custom message..."
      />

      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} style={{ background: "#6f42c1" }} />
      <Handle type="source" position={Position.Right} style={{ background: "#6f42c1" }} />
    </div>
  );
};

export default CustomMessageNode;
