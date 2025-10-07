import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
    {
        name: {type: String, required: true}, 
        sets: {type: Number, required: true}, 
        reps: {type: Number, required: true}, 
        weight: {type: Number, required: true},
        date: {type: Date, default: Date.now}
    },
    {timestamps: true}
);

export const Workout = mongoose.model("Workout", workoutSchema); 