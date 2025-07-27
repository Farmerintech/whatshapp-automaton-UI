import React, { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";

const QuickReplyNode = ({ id, data }) => {
  const [options, setOptions] = useState(data.options || ["Yes", "No"]);

  // Sync local state when node loads or updates
  useEffect(() => {
    setOptions(data.options || ["Yes", "No"]);
  }, [data.options]);

  const deleteNode = () => {
    const event = new CustomEvent("delete-node", { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    dispatchOptionsUpdate(newOptions);
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    dispatchOptionsUpdate(updated);
  };

  const dispatchOptionsUpdate = (updatedOptions) => {
    const updateEvent = new CustomEvent("update-node-options", {
      detail: { nodeId: id, options: updatedOptions },
    });
    window.dispatchEvent(updateEvent);
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

      <strong>{data.label || "Quick Reply"}</strong>

      {/* Editable Options */}
      <div style={{ marginTop: "8px" }}>
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            value={opt}
            onChange={(e) => updateOption(idx, e.target.value)}
            style={{
              width: "100%",
              marginBottom: "4px",
              padding: "4px",
              border: "1px solid #a3cfbb",
              borderRadius: "4px",
              fontFamily: "Arial, sans-serif",
            }}
          />
        ))}
        <button
          onClick={addOption}
          style={{
            marginTop: "4px",
            padding: "4px 8px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          + Add Option
        </button>
      </div>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} style={{ background: "#28a745" }} />
      <Handle type="source" position={Position.Right} style={{ background: "#28a745" }} />
    </div>
  );
};

export default QuickReplyNode;
