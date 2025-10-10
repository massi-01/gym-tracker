// src/components/AddExistingExerciseForm.jsx
function AddExistingExerciseForm({
  allExercises,
  selectedExerciseId,
  existingWorkoutDetails,
  onSelectExercise,
  onChangeDetails,
  onAdd,
}) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Aggiungi esercizio esistente</h3>
      <div className="mb-2">
        <select
          value={selectedExerciseId}
          onChange={(e) => onSelectExercise(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Seleziona un esercizio --</option>
          {allExercises.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.name} ({ex.muscleGroup})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {["sets", "reps", "weight"].map((field) => (
          <input
            key={field}
            type="number"
            placeholder={field === "weight" ? "Peso (kg)" : field}
            value={existingWorkoutDetails[field]}
            onChange={(e) =>
              onChangeDetails({ ...existingWorkoutDetails, [field]: e.target.value })
            }
            className="border p-2 rounded"
          />
        ))}
      </div>
      <button
        onClick={onAdd}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-8"
      >
        ➕ Aggiungi esercizio esistente
      </button>
    </>
  );
}

export default AddExistingExerciseForm;
