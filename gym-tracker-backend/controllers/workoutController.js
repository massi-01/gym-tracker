// controllers/workoutController.js
import Workout from "../models/workoutModels.js";
import Exercise from "../models/exerciseModels.js";

// ✅ GET: Tutti i workout
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().populate("exercise");
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei workout: " + error.message });
  }
};

// ✅ GET: Workout per ID
export const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;
    const workout = await Workout.findById(id).populate("exercise");

    if (!workout) {
      return res.status(404).json({ message: "Workout non trovato" });
    }

    res.status(200).json({ data: workout });
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero del workout: " + error.message });
  }
};

// ✅ POST: Crea un nuovo workout
export const createWorkout = async (req, res) => {
  try {
    const { exercise, sets, reps, weight, date } = req.body;

    let exerciseId;

    // 🔹 Se l'esercizio è un oggetto, crealo
    if (typeof exercise === "object" && exercise !== null) {
      const existingExercise = await Exercise.findOne({ name: exercise.name });

      if (existingExercise) {
        exerciseId = existingExercise._id;
      } else {
        const newExercise = await Exercise.create(exercise);
        exerciseId = newExercise._id;
      }
    } else {
      // 🔹 Altrimenti usa direttamente l'ID
      exerciseId = exercise;
    }

    // 🔹 Crea il workout vero e proprio
    const workout = await Workout.create({
      exercise: exerciseId,
      sets,
      reps,
      weight,
      date: date || Date.now(),
    });

    const populatedWorkout = await workout.populate("exercise");

    res.status(201).json(populatedWorkout);
  } catch (error) {
    res.status(500).json({ message: "Errore nella creazione del workout: " + error.message });
  }
};

// ✅ PATCH: Aggiorna un workout
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { exercise, sets, reps, weight, date } = req.body;

    let exerciseId = exercise;

    // Se l'utente invia un nuovo oggetto esercizio
    if (typeof exercise === "object" && exercise !== null) {
      const existingExercise = await Exercise.findOne({ name: exercise.name });

      if (existingExercise) {
        exerciseId = existingExercise._id;
      } else {
        const newExercise = await Exercise.create(exercise);
        exerciseId = newExercise._id;
      }
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { exercise: exerciseId, sets, reps, weight, date },
      { new: true }
    ).populate("exercise");

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout non trovato: " + id});
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(400).json({ message: "Errore nell'aggiornamento: " + error.message });
  }
};

// ✅ DELETE: Elimina un workout
export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkout = await Workout.findByIdAndDelete(id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout non trovato" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Errore nella cancellazione: " + error.message });
  }
};
