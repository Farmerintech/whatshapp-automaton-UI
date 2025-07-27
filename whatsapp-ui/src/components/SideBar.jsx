import React from "react";
import { useDragDrop } from "../context/drag-drop";

const templates = [
  { label: "Welcome Message", text: "Hello! Thanks for connecting.", type: "template" },
  { label: "Promo Offer", text: "Get 20% off your first order!", type: "template" },
  { label: "Follow Up", text: "How can we help you today?", type: "template" }
];

function Sidebar() {
  const [_, setData] = useDragDrop();

  const onDragStart = (event, nodeData) => {
    setData(nodeData);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside style={{
      width: "25%",
      backgroundColor: "#f5f5f5",
      padding: "16px",
      borderRight: "1px solid #ddd",
      height: "100vh",
      overflowY: "auto"
    }}>
      <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>Templates</h3>
      {templates.map((tpl, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={(e) => onDragStart(e, tpl)}
          style={{
            backgroundColor: "#cce5ff",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "8px",
            cursor: "grab"
          }}
        >
          {tpl.label}
        </div>
      ))}

      <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>Other Messages</h3>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, { label: "Quick Reply", type: "quick" })}
        style={{
          backgroundColor: "#d4edda",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "8px",
          cursor: "grab"
        }}
      >
        Quick Reply
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, { label: "Custom Message", type: "custom" })}
        style={{
          backgroundColor: "#e2d4f0",
          padding: "10px",
          borderRadius: "4px",
          cursor: "grab"
        }}
      >
        Custom Message
      </div>
      <div
  draggable
  onDragStart={(e) =>
    onDragStart(e, { label: "Logic Branch", condition: 'reply == "Yes"', type: "logic" })
  }
  style={{
    padding: "8px",
    marginBottom: "8px",
    background: "#ffeeba",
    border: "1px solid #ffdf7e",
    borderRadius: "4px",
    cursor: "move",
    marginTop:"8px"
  }}
>
  Logic Branch (If / Else)
</div>

    </aside>
  );
}

export default Sidebar;
