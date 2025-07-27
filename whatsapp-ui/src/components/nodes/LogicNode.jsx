import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

const LogicNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data.condition || 'reply == "Yes"');

  const deleteNode = () => {
    const event = new CustomEvent("delete-node", { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      style={{
        background: "#fff3cd",
        border: "1px solid #ffeeba",
        borderRadius: "6px",
        padding: "10px",
        width: "240px",
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

      <strong>Logic Branch</strong>
      <p style={{ fontSize: "12px", margin: "6px 0" }}>Define a condition</p>

      <textarea
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        style={{
          width: "100%",
          minHeight: "40px",
          border: "1px solid #ffeeba",
          borderRadius: "4px",
          padding: "4px",
          resize: "none",
          fontFamily: "Arial, sans-serif",
        }}
      />

      <p style={{ fontSize: "12px", marginTop: "4px" }}>
        If true → Right output, If false → Bottom output
      </p>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} style={{ background: "#856404" }} />
      {/* True branch (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="true-branch"
        style={{ background: "#28a745" }}
      />
      {/* False branch (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false-branch"
        style={{ background: "#dc3545" }}
      />
    </div>
  );
};

export default LogicNode;
