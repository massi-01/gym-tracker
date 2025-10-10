// src/components/AddNewExerciseForm.jsx
function AddNewExerciseForm({ newWorkout, setNewWorkout, onAdd }) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">
        Oppure aggiungi un nuovo esercizio
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Nome esercizio"
          value={newWorkout.exercise.name}
          onChange={(e) =>
            setNewWorkout({
              ...newWorkout,
              exercise: { ...newWorkout.exercise, name: e.target.value },
            })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Gruppo muscolare"
          value={newWorkout.exercise.muscleGroup}
          onChange={(e) =>
            setNewWorkout({
              ...newWorkout,
              exercise: { ...newWorkout.exercise, muscleGroup: e.target.value },
            })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Attrezzatura"
          value={newWorkout.exercise.equipment}
          onChange={(e) =>
            setNewWorkout({
              ...newWorkout,
              exercise: { ...newWorkout.exercise, equipment: e.target.value },
            })
          }
          className="border p-2 rounded"
        />
        {["sets", "reps", "weight"].map((f) => (
          <input
            key={f}
            type="number"
            placeholder={f === "weight" ? "Peso (kg)" : f}
            value={newWorkout[f]}
            onChange={(e) =>
              setNewWorkout({ ...newWorkout, [f]: Number(e.target.value) })
            }
            className="border p-2 rounded"
          />
        ))}
      </div>
      <button
        onClick={onAdd}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-6"
      >
        ➕ Aggiungi nuovo esercizio
      </button>
    </>
  );
}

export default AddNewExerciseForm;
