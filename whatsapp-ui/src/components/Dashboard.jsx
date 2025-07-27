import React, { useState } from "react";
import DragDropContext from "../context/drag-drop";
import Sidebar from "./Sidebar";
import { Workflow } from "./Workflow";
import { ReactFlowProvider } from "@xyflow/react";

const Dashboard = () => {
  const [data, setData] = useState(null);

  return (
    <DragDropContext.Provider value={[data, setData]}>
      <ReactFlowProvider>
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0,
          }}
          className="bg-red-500"
        >
          <Sidebar />
          <div style={{ width: "75%", height: "100%" }}>
            <Workflow />
          </div>
        </div>
      </ReactFlowProvider>
    </DragDropContext.Provider>
  );
};

export default Dashboard;
