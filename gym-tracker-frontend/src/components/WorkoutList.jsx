// src/components/WorkoutList.jsx
function WorkoutList({
  workouts,
  editingWorkoutIndex,
  editingWorkoutFields,
  onEditWorkout,
  onUpdateWorkout,
  onCancelEdit,
  onRemoveWorkout,
  setEditingWorkoutFields,
}) {
  if (!workouts || workouts.length === 0) {
    return <p className="text-gray-600">Nessun esercizio ancora</p>;
  }

  return (
    <ul className="space-y-3 mb-6">
      {workouts.map((w, i) => (
        <li
          key={w._id || i}
          className="bg-gray-100 p-3 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
        >
          <div>
            <strong className="block">
              {w.exercise?.name ||
                (typeof w.exercise === "string"
                  ? `Esercizio (${w.exercise})`
                  : "Esercizio sconosciuto")}
            </strong>
            <div className="text-sm text-gray-600">
              {w.exercise?.muscleGroup || ""}{" "}
              {w.exercise?.equipment ? `| ${w.exercise.equipment}` : ""}
            </div>
            <div className="text-sm mt-1">
              {editingWorkoutIndex === i ? (
                <>
                  <input
                    type="number"
                    className="border p-1 rounded w-20 mr-2"
                    value={editingWorkoutFields?.sets}
                    onChange={(e) =>
                      setEditingWorkoutFields({
                        ...editingWorkoutFields,
                        sets: e.target.value,
                      })
                    }
                    placeholder="Serie"
                  />
                  <input
                    type="number"
                    className="border p-1 rounded w-20 mr-2"
                    value={editingWorkoutFields?.reps}
                    onChange={(e) =>
                      setEditingWorkoutFields({
                        ...editingWorkoutFields,
                        reps: e.target.value,
                      })
                    }
                    placeholder="Ripetizioni"
                  />
                  <input
                    type="number"
                    className="border p-1 rounded w-24"
                    value={editingWorkoutFields?.weight}
                    onChange={(e) =>
                      setEditingWorkoutFields({
                        ...editingWorkoutFields,
                        weight: e.target.value,
                      })
                    }
                    placeholder="Peso kg"
                  />
                </>
              ) : (
                <>
                  {w.sets}x{w.reps} @ {w.weight}kg
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            {editingWorkoutIndex === i ? (
              <>
                <button
                  onClick={onUpdateWorkout}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Salva
                </button>
                <button
                  onClick={onCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                >
                  Annulla
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onEditWorkout(i)}
                  className="text-yellow-600 hover:underline"
                >
                  Modifica
                </button>
                <button
                  onClick={() => onRemoveWorkout(i)}
                  className="text-red-600 hover:underline"
                >
                  Elimina
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default WorkoutList;
