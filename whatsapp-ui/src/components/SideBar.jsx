import React from "react";
import { useDragDrop } from "../context/drag-drop";

// Prebuilt Quick Replies
const quickReplyTemplates = {
  "Payment Confirmation": ["Payment received", "Pending payment", "Failed payment"],
  "Thank You": ["Thank you for your order!", "We appreciate your business!", "Thanks, come again!"],
  "Follow Up": ["Is there anything else you need?", "Would you like to continue?", "Can we assist further?"],
  "General Yes/No": ["Yes", "No"],
};

// Standard message templates
const templates = [
  { label: "Welcome Message", text: "Hello! Thanks for connecting.", type: "template" },
  { label: "Promo Offer", text: "Get 20% off your first order!", type: "template" },
  { label: "Follow Up", text: "How can we help you today?", type: "template" },
];

function Sidebar() {
  const [_, setData] = useDragDrop();

  const onDragStart = (event, nodeData) => {
    setData(nodeData);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      style={{
        width: "25%",
        backgroundColor: "#f5f5f5",
        padding: "16px",
        borderRight: "1px solid #ddd",
        height: "auto",
        overflowY: "scroll",
      }}
    >
      {/* STANDARD MESSAGE TEMPLATES */}
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
            cursor: "grab",
          }}
        >
          {tpl.label}
        </div>
      ))}

      {/* QUICK REPLIES LIST */}
      <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>Quick Replies</h3>
      <div>
        {Object.keys(quickReplyTemplates).map((reply, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) =>
              onDragStart(e, {
                label: reply,
                type: "quick",
                options: quickReplyTemplates[reply],
                selected: quickReplyTemplates[reply][0] || "",
              })
            }
            style={{
              backgroundColor: "#d4edda",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "8px",
              cursor: "grab",
              textAlign: "center",
            }}
          >
            {reply}
          </div>
        ))}
      </div>

      {/* CUSTOM MESSAGE NODE */}
      <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>Custom Message</h3>
      <div
        draggable
        onDragStart={(e) =>
          onDragStart(e, { label: "Custom Message", text: "", type: "custom" })
        }
        style={{
          backgroundColor: "#ffe4b5",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "8px",
          cursor: "grab",
          textAlign: "center",
        }}
      >
        Custom Message Node
      </div>

      {/* FIXED OPTION NODE */}
      <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>Option Replies</h3>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, { label: "Quick Options", type: "option" })}
        style={{
          backgroundColor: "#d4edda",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "8px",
          cursor: "grab"
        }}
      >
        Options Reply
      </div>

      {/* LOGIC BRANCH */}
      <div
        draggable
        onDragStart={(e) =>
          onDragStart(e, { label: "Logic Branch", condition: 'reply == "Yes"', type: "logic" })
        }
        style={{
          padding: "8px",
          marginBottom: "8px",
          border: "1px solid #ffdf7e",
          borderRadius: "4px",
          cursor: "move",
          marginTop: "8px",
        }}
        className="bg-[#ffeeba]"
      >
        Logic Branch (If / Else)
      </div>
    </aside>
  );
}

export default Sidebar;
