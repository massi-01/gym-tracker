import express from "express";

import {
 getExercise, 
 createExercise,
 updateExercise,
 deleteExercise
} from "../controllers/exerciseController.js";

const router = express.Router(); 

router.get("/", getExercise); 
router.post("/", createExercise); 
router.patch("/:id", updateExercise); 
router.delete("/:id", deleteExercise); 

export default router; 