import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";

const Flow = sequelize.define("Flow", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nodes: {
    type: DataTypes.JSON, // store ReactFlow nodes
    allowNull: false,
    defaultValue: [],
  },
  edges: {
    type: DataTypes.JSON, // store ReactFlow edges
    allowNull: false,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Associations
User.hasMany(Flow, { foreignKey: "userId" });
Flow.belongsTo(User, { foreignKey: "userId" });

export default Flow;
