import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

const LogicNode = ({ id, data, isConnectable }) => {
  const [condition, setCondition] = useState(data.condition || 'reply === "Yes"');

  const deleteNode = () => {
    const event = new CustomEvent("delete-node", { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  // Save the updated condition back to the node
  const updateCondition = (value) => {
    setCondition(value);
    const event = new CustomEvent("update-node-condition", {
      detail: { nodeId: id, condition: value },
    });
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
      <p style={{ fontSize: "12px", margin: "6px 0" }}>Set your condition:</p>

      <input
        type="text"
        value={condition}
        onChange={(e) => updateCondition(e.target.value)}
        style={{
          width: "100%",
          border: "1px solid #ffeeba",
          borderRadius: "4px",
          padding: "4px",
          fontFamily: "monospace",
        }}
        placeholder='e.g. reply === "Yes"'
      />

      <p style={{ fontSize: "12px", marginTop: "4px" }}>
        Incoming → Right | True → Left | False → Bottom
      </p>

      {/* Handles */}
      {/* Incoming (Right) */}
      <Handle
        type="target"
        position={Position.Right}
        id="incoming"
        isConnectable={isConnectable}
        style={{ background: "#856404", width: 12, height: 12, borderRadius: "50%" }}
      />

      {/* True output (Left) */}
      <Handle
        type="source"
        position={Position.Left}
        id="true-branch"
        isConnectable={isConnectable}
        style={{ background: "#28a745", width: 12, height: 12, borderRadius: "50%" }}
      />

      {/* False output (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false-branch"
        isConnectable={isConnectable}
        style={{ background: "#dc3545", width: 12, height: 12, borderRadius: "50%" }}
      />
    </div>
  );
};

export default LogicNode;
