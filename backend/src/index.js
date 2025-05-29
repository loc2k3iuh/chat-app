import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';
import authRoutes from './routers/auth.route.js';
import messageRoutes from './routers/message.route.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { app, server } from './lib/socket.js';
import path from "path";

dotenv.config();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' })); // Increased size limit for JSON data
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For form data
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Register routes before starting server
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle React Router routes - serve index.html for all non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, ()=> {
    console.log("Server is running on PORT:"+ PORT);
    connectDB();
})