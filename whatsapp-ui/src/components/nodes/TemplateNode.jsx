import React from "react";
import { Handle, Position } from "@xyflow/react";

function TemplateNode({ id, data }) {
  const deleteNode = () => {
    const event = new CustomEvent("delete-node", { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      style={{
        border: "1px solid #888",
        padding: "8px",
        borderRadius: "5px",
        background: "#e3f2fd",
        position: "relative",
        minWidth: "150px",
      }}
    >
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
      <strong>{data.label || "Template"}</strong>
      <p style={{ margin: "5px 0 0", fontSize: "12px" }}>{data.text || ""}</p>

      <Handle type="target" position={Position.Left} style={{ background: "#555" }} />
      <Handle type="source" position={Position.Right} style={{ background: "#555" }} />
    </div>
  );
}

export default TemplateNode;
