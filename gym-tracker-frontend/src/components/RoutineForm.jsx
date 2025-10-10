import { useEffect, useState } from "react";

function RoutineForm({ onAdd, API_URL }) {
  const [name, setName] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalSelections, setModalSelections] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${API_URL}/exercises`);
        const data = await res.json();
        setExercises(data.data || data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExercises();
  }, [API_URL]);

  const handleAddExercisesFromModal = () => {
    const newExercises = modalSelections.map((id) => ({
      exercise: id,
      sets: "",
      reps: "",
      weight: "",
    }));
    setSelectedExercises((prev) => [...prev, ...newExercises]);
    setModalSelections([]);
    setShowModal(false);
  };

  const handleRemoveExercise = (index) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setSelectedExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/routines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dayOfWeek,
          workouts: selectedExercises,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAdd(data);
        setName("");
        setDayOfWeek("");
        setSelectedExercises([]);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-4 rounded-md shadow-sm mb-6 space-y-4"
      >
        <div className="flex flex-col gap-2">
          <label className="font-medium">Nome routine</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md"
            placeholder="Routine A, Routine B..."
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Giorno della settimana</label>
          <input
            type="text"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="border p-2 rounded-md"
            placeholder="Lunedì, Mercoledì..."
            required
          />
        </div>

        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => setShowModal(true)}
        >
          Aggiungi Esercizi
        </button>

        {selectedExercises.map((ex, index) => {
          const exercise = exercises.find((e) => e._id === ex.exercise);
          return (
            <div
              key={index}
              className="border p-3 rounded-md mt-2 bg-white flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <ul className="text-sm text-gray-700">
                    <li className="font-semibold text-gray-900">{exercise?.name}</li>
                    <li>Gruppo muscolare: {exercise?.muscleGroup}</li>
                    <li>Attrezzatura: {exercise?.equipment}</li>
                    {exercise?.description && <li>Descrizione: {exercise?.description}</li>}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                >
                  Rimuovi
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Serie"
                  value={ex.sets}
                  onChange={(e) => handleChange(index, "sets", e.target.value)}
                  className="border p-1 rounded w-20"
                  required
                />
                <input
                  type="number"
                  placeholder="Ripetizioni"
                  value={ex.reps}
                  onChange={(e) => handleChange(index, "reps", e.target.value)}
                  className="border p-1 rounded w-24"
                  required
                />
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  value={ex.weight}
                  onChange={(e) => handleChange(index, "weight", e.target.value)}
                  className="border p-1 rounded w-24"
                />
              </div>
            </div>
          );
        })}

        {selectedExercises.length > 0 && (
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-2"
          >
            Salva Routine
          </button>
        )}
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md w-full max-w-md h-[80vh] flex flex-col">
            {/* Header fisso */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Seleziona esercizi</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Lista scrollabile */}
            <div className="flex-1 overflow-auto p-4 space-y-2">
              {exercises.map((ex) => (
                <label
                  key={ex._id}
                  className="flex items-center gap-2 border-b py-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={ex._id}
                    checked={modalSelections.includes(ex._id)}
                    onChange={(e) => {
                      const id = e.target.value;
                      setModalSelections((prev) =>
                        prev.includes(id)
                          ? prev.filter((i) => i !== id)
                          : [...prev, id]
                      );
                    }}
                    className="flex-shrink-0"
                  />
                  <div className="text-sm text-gray-700">
                    <div className="font-semibold text-gray-900">{ex.name}</div>
                    <div>Gruppo muscolare: {ex.muscleGroup}</div>
                    <div>Attrezzatura: {ex.equipment}</div>
                    {ex.description && <div>Descrizione: {ex.description}</div>}
                  </div>
                </label>
              ))}
            </div>

            {/* Footer fisso */}
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-500 text-white"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleAddExercisesFromModal}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Aggiungi Selezionati
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RoutineForm;
