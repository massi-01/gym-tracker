// src/utils/routineUtils.js
export function prepareWorkoutsForPayload(workouts) {
  return (workouts || []).map((w) => {
    if (w.exercise && typeof w.exercise === "object" && w.exercise._id) {
      return {
        exercise: String(w.exercise._id),
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        date: w.date,
      };
    } else if (typeof w.exercise === "string") {
      return {
        exercise: w.exercise,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        date: w.date,
      };
    } else if (w.exercise && typeof w.exercise === "object") {
      const { name, muscleGroup, equipment, description } = w.exercise;
      return {
        exercise: { name, muscleGroup, equipment, description },
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        date: w.date,
      };
    } else {
      return w;
    }
  });
}
