import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import Register from "./components/register";
import { useNodesState, useEdgesState } from "@xyflow/react";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [user, setUser] = useState(null);

  // Check if token exists (auto-login if stored)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeFlowId, setActiveFlowId] = useState(null);
  const [flowName, setFlowName] = useState("");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<Register onRegister={handleLogin} />}
        />
        <Route
        path="/chat"
        element={<ChatWindow/>}
        />
        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <section>
                <div className="bg-[#f5f5f5] py-[8px] flex justify-between ">
                  <p className="text-xl font-[600] px-4">
                    Welcome back {user.username}
                  </p>
                  <button
                    onClick={() => {
                      setNodes([]);
                      setEdges([]);
                      setActiveFlowId(null);
                      setFlowName("");
                    }}
                    className="px-[10px] py-[6px] border-none pointer text-white bg-blue-500 rounded-[8px]"
                  >
                    + New chat agent
                  </button>
                </div>
                <Dashboard
                  onLogout={handleLogout}
                  user={user}
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
              </section>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
