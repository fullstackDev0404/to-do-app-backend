require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth");
const todoRoutes = require("./src/routes/todos");

const app = express();

connectDB();

const corsOrigin = process.env.CLIENT_URL || "http://localhost:3000";
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/todos",todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{

  console.log(`Server running on port ${PORT}`);

});