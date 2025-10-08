import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    exercise: {type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true},
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout; 