import React, { useState } from "react";
import DragDropContext from "../context/drag-drop";
import Sidebar from "./Sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import { Workflow } from "./WorkFlow";
const Dashboard = (
   { nodes, setNodes, onNodesChange,
  edges, setEdges, onEdgesChange,
  activeFlowId, setActiveFlowId,
  flowName, setFlowName}
) => {
  const [data, setData] = useState(null);

  return (
    <DragDropContext.Provider value={[data, setData]}>
      <ReactFlowProvider>
        <div className="flex p-0 m-0 h-screen">
          <Sidebar />
          <div className="w-3/4 h-full">
            <Workflow
              nodes={nodes}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              edges={edges}
              setEdges={setEdges}
              onEdgesChange={onEdgesChange}
              activeFlowId={activeFlowId}
              setActiveFlowId={setActiveFlowId}
              flowName={flowName}
              setFlowName={setFlowName}
            />
          </div>
        </div>
      </ReactFlowProvider>
    </DragDropContext.Provider>
  );
};

export default Dashboard;
