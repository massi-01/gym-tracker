import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import workoutRoutes from "./routes/workoutRoutes.js"; 

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/workouts", workoutRoutes); 

// Test route
app.get("/", (req, res) => {
  res.send("Server Gym Tracker attivo! 💪");
});

// Connessione al DB e avvio server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server attivo su porta ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Errore di connessione:", err));
