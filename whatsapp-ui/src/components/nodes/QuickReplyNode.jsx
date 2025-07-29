import React from "react";
import { Handle, Position } from "@xyflow/react";

const QuickReplyNode = ({ id, data }) => {
  const deleteNode = () => {
    const event = new CustomEvent("delete-node", { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      style={{
        background: "#d4edda",
        border: "1px solid #a3cfbb",
        borderRadius: "6px",
        padding: "10px",
        width: "200px",
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

      {/* Just the Quick Reply Title */}
      <strong>{data.label || "Quick Reply"}</strong>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} style={{ background: "#28a745" }} />
      <Handle type="source" position={Position.Right} style={{ background: "#28a745" }} />
    </div>
  );
};

export default QuickReplyNode;
