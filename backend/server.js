require("dotenv").config();
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET" , 'POST' , 'PUT' , 'DELETE'],
    allowedHeaders: ["content-type", "Authorization"],
  })
);

app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/reports", reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});