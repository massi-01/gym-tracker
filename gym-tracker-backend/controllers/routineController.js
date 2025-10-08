import Routine from "../models/routineModels.js";
import Workout from "../models/workoutModels.js";
import Exercise from "../models/exerciseModels.js";

// ✅ GET: Tutte le routine
export const getRoutines = async (_req, res) => {
  try {
    const routines = await Routine.find().populate({
      path: "workouts",
      populate: { path: "exercise" }, // Popola anche gli esercizi all'interno dei workout
    });

    res.status(200).json(routines);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nel recupero delle routine: " + error.message });
  }
};

// ✅ GET: Routine per ID
export const getRoutineById = async (req, res) => {
  try {
    const { id } = req.params;
    const routine = await Routine.findById(id).populate({
      path: "workouts",
      populate: { path: "exercise" },
    });

    if (!routine) {
      return res.status(404).json({ message: "Routine non trovata" });
    }

    res.status(200).json({ data: routine });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nel recupero della routine: " + error.message });
  }
};

// ✅ POST: Crea una nuova routine
export const createRoutine = async (req, res) => {
  try {
    const { name, dayOfWeek, workouts } = req.body;

    if (!name || !dayOfWeek) {
      return res
        .status(400)
        .json({ message: "Nome e giorno sono obbligatori" });
    }

    const workoutIds = [];

    for (const w of workouts || []) {
      let exerciseId;

      if (w.exercise && typeof w.exercise === "object" && w.exercise !== null) {
        const newExercise = await Exercise.create(w.exercise);
        exerciseId = newExercise._id;
      }
      else if (typeof w.exercise === "string") {
        exerciseId = w.exercise;
      } else {
        throw new Error("Campo exercise mancante o non valido");
      }

      const newWorkout = await Workout.create({
        exercise: exerciseId,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        date: w.date,
      });

      workoutIds.push(newWorkout._id);
    }

    const routine = await Routine.create({
      name,
      dayOfWeek,
      workouts: workoutIds,
    });

    const populatedRoutine = await routine.populate({
      path: "workouts",
      populate: { path: "exercise" },
    });

    res.status(201).json(populatedRoutine);
  } catch (error) {
    console.error("Errore nella creazione routine:", error);
    res
      .status(500)
      .json({ message: "Errore nella creazione routine: " + error.message });
  }
};

// ✅ PATCH: Aggiorna una routine esistente
export const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dayOfWeek, workouts } = req.body;

    const routine = await Routine.findById(id);
    if (!routine) {
      return res.status(404).json({ message: "Routine non trovata" });
    }

    const workoutIds = [];

    for (const w of workouts || []) {
      let exerciseId;

      // Se l'esercizio è un oggetto → crealo
      if (w.exercise && typeof w.exercise === "object" && w.exercise !== null) {
        const newExercise = await Exercise.create(w.exercise);
        exerciseId = newExercise._id;
      }
      // Se è un ID esistente → usalo
      else if (typeof w.exercise === "string") {
        exerciseId = w.exercise;
      } else {
        throw new Error("Campo exercise mancante o non valido");
      }

      // Se è un oggetto workout → crealo
      if (typeof w === "object" && !w._id) {
        const newWorkout = await Workout.create({
          exercise: exerciseId,
          sets: w.sets,
          reps: w.reps,
          weight: w.weight,
          date: w.date,
        });
        workoutIds.push(newWorkout._id);
      } else {
        workoutIds.push(w._id || w);
      }
    }

    // Aggiorna i campi principali della routine
    routine.name = name || routine.name;
    routine.dayOfWeek = dayOfWeek || routine.dayOfWeek;
    routine.workouts = workoutIds;

    const updatedRoutine = await routine.save();

    const populatedRoutine = await updatedRoutine.populate({
      path: "workouts",
      populate: { path: "exercise" },
    });

    res.status(200).json(populatedRoutine);
  } catch (error) {
    console.error("Errore nell'aggiornamento routine:", error);
    res.status(400).json({ message: "Errore nell'aggiornamento: " + error.message });
  }
};


// ✅ DELETE: Elimina una routine
export const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoutine = await Routine.findByIdAndDelete(id);

    if (!deletedRoutine) {
      return res.status(404).json({ message: "Routine non trovata" });
    }

    res.status(200).json({ message: "Routine eliminata con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nella cancellazione: " + error.message });
  }
};
