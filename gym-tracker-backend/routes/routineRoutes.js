import express from "express";

import {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routineController.js";

const router = express.Router(); 

router.get("/", getRoutines); 
router.get("/:id", getRoutineById); 
router.post("/", createRoutine); 
router.patch("/:id", updateRoutine); 
router.delete("/:id", deleteRoutine); 

export default router; 