import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import DB from "../config/db.js";

const User = DB.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
export default User;

// (async () => {
//   try {
//     // Drop and recreate all tables, including User
//     await DB.sync({ force: true }); 
//     console.log("Database synced: All tables dropped and recreated.");
//   } catch (error) {
//     console.error("Error syncing database:", error);
//   } finally {
//     await DB.close();
//   }
// })();