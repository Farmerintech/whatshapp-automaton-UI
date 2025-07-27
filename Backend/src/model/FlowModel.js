import { DataTypes } from "sequelize";
import User from "./UserModel.js";
import DB from "../config/db.js";

const Flow = DB.define("Flow", {
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
