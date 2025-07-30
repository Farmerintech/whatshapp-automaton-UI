import React, { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";

const ConditionNode = ({ id, data, isConnectable }) => {
  const [conditions, setConditions] = useState(
    data.conditions && data.conditions.length > 0
      ? data.conditions.map((cond, idx) => ({
          ...cond,
          branch: cond.branch || `branch${idx + 1}`,
        }))
      : [{ value: "", branch: "branch1" }]
  );

  const [defaultBranch, setDefaultBranch] = useState(data.defaultBranch || "");

  useEffect(() => {
    updateNode("conditions", conditions);
  }, [conditions]);

  useEffect(() => {
    updateNode("defaultBranch", defaultBranch);
  }, [defaultBranch]);

  // Ensures node updates its internal data
  const updateNode = (key, value) => {
    const event = new CustomEvent("update-condition-node", {
      detail: { nodeId: id, key, value },
    });
    window.dispatchEvent(event);
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;

    // If changing the value field and branch is empty, auto-generate a branch name
    if (field === "value" && !newConditions[index].branch) {
      newConditions[index].branch = `branch${index + 1}`;
    }

    setConditions(newConditions);
  };

  const addCondition = () => {
    const newCondition = {
      value: "",
      branch: `branch${conditions.length + 1}`, // <-- Always assign a branch
    };
    setConditions([...conditions, newCondition]);
  };

  const deleteNode = () => {
    const event = new CustomEvent("delete-node", { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      style={{
        background: "#f0f4ff",
        border: "1px solid #bee3f8",
        borderRadius: "8px",
        padding: "12px",
        width: "260px",
        fontFamily: "Arial",
        position: "relative",
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
        }}
      >
        ×
      </button>

      <strong>Logic Branch</strong>

      <div style={{ marginTop: "10px" }}>
        <strong>Options:</strong>
        {conditions.map((cond, idx) => (
          <div
            key={idx}
            style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
          >
            <input
              placeholder="Value"
              value={cond.value}
              onChange={(e) =>
                handleConditionChange(idx, "value", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <input
              placeholder="Branch ID"
              value={cond.branch}
              onChange={(e) =>
                handleConditionChange(idx, "branch", e.target.value)
              }
              style={{ flex: 1 }}
            />
          </div>
        ))}
        <button onClick={addCondition} style={{ marginTop: "4px" }}>
          + Add Option
        </button>
      </div>

      <div style={{ marginTop: "8px" }}>
        <label>Default Branch:</label>
        <input
          type="text"
          value={defaultBranch}
          onChange={(e) => setDefaultBranch(e.target.value)}
          placeholder="fallback-node-id"
          style={{ width: "100%", marginTop: "4px" }}
        />
      </div>

      {/* Incoming connection */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: "#4299e1", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />

      {/* Each condition as an output */}
      {conditions.map((cond, idx) => (
        <Handle
          key={cond.branch}
          type="source"
          position={Position.Right}
          id={cond.branch}
          style={{
            top: `${80 + idx * 20}px`,
            background: "#48bb78",
            width: 12,
            height: 12,
            borderRadius: "50%",
            position: "absolute",
            right: -6,
          }}
          isConnectable={isConnectable}
        />
      ))}

      {/* Default fallback branch */}
      {defaultBranch && (
        <Handle
          type="source"
          position={Position.Bottom}
          id={defaultBranch}
          style={{ background: "#f56565", width: 12, height: 12 }}
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
};

export default ConditionNode;
