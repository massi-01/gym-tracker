import mongoose from "mongoose";

const routineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dayOfWeek: { type: String, required: true },
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workout" }],
    createdAt: { type: Date, default: Date.now },
  }
);

const Routine = mongoose.model('Routine', routineSchema);
export default Routine;