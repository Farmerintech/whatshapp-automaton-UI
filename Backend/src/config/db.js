import { Sequelize } from "sequelize";

const DB = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
    dialectOptions: {
    ssl: {
      require: true, // Ensure SSL is used
      rejectUnauthorized: false, // Disable certificate validation (Render PostgreSQL)
    }
  }

});

export default DB;
