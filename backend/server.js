require("dotenv").config();
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require("./config/db");
const Task = require("./models/Task");


const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");
const reportRoutes = require("./routes/ReportRoutes");




const app = express()



app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET" , 'POST' , 'PUT' , 'DELETE'],
    allowedHeaders: ["content-type", "Authorization"],
  })
);

//old tasks were saved as "pending" / "completed" -> convert to the current status names
connectDB().then(async () => {
  await Task.updateMany({status: "pending"}, {$set: {status: "Pending"}});
  await Task.updateMany({status: "completed"}, {$set: {status: "Completed"}});
  await Task.updateMany({status: "in progress"}, {$set: {status: "In Progress"}});
});

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});