const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const taskRoutes = require("./routes/task.route");
const userRoutes = require("./routes/user.route");
const reportRoutes = require("./routes/report.route");
const connectDB = require("./utils/db");

const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();

connectDB();
app.use(
  cors({
    origin: "https://task-management-app-blue-five.vercel.app/",
    // origin: "http://localhost:3000", 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hi from backend! API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
