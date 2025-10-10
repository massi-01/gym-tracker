import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function RoutineDetail() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [routine, setRoutine] = useState({
    name: "",
    dayOfWeek: "",
    workouts: [],
  });

  const [allExercises, setAllExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [existingWorkoutDetails, setExistingWorkoutDetails] = useState({
    sets: "",
    reps: "",
    weight: "",
  });

  const [newWorkout, setNewWorkout] = useState({
    exercise: { name: "", muscleGroup: "", equipment: "", description: "" },
    sets: "",
    reps: "",
    weight: "",
  });

  const [editingWorkoutIndex, setEditingWorkoutIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("existing");

  // 🔹 Fetch esercizi
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${API_URL}/exercises`);
        const data = await res.json();
        setAllExercises(data.data || data);
      } catch (error) {
        console.error("Errore fetch exercises:", error);
      }
    };
    fetchExercises();
  }, [API_URL]);

  // 🔹 Fetch routine
  useEffect(() => {
    if (id && id !== "new") {
      const fetchRoutine = async () => {
        try {
          const res = await fetch(`${API_URL}/routines/${id}`);
          const json = await res.json();
          const data = json.data || json;

          setRoutine({
            name: data.name || "",
            dayOfWeek: data.dayOfWeek || "",
            workouts: Array.isArray(data.workouts) ? data.workouts : [],
          });
        } catch (error) {
          console.error("Errore fetch routine:", error);
        }
      };
      fetchRoutine();
    }
  }, [API_URL, id]);

  // 🔹 Salva routine
  const handleSave = async () => {
    try {
      const isNew = !id || id === "new";
      const method = isNew ? "POST" : "PATCH";
      const url = isNew ? `${API_URL}/routines` : `${API_URL}/routines/${id}`;

      const payload = {
        ...routine,
        workouts: routine.workouts.map((w) => ({
          exercise: w.exercise._id
            ? w.exercise._id
            : {
                name: w.exercise.name,
                muscleGroup: w.exercise.muscleGroup,
                equipment: w.exercise.equipment,
                description: w.exercise.description,
              },
          sets: w.sets,
          reps: w.reps,
          weight: w.weight,
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Errore salvataggio routine");
      navigate(-1); // Torna indietro alla pagina precedente
    } catch (error) {
      console.error(error);
      alert("Errore durante il salvataggio");
    }
  };

  // 🔹 Aggiungi esercizio esistente
  const handleAddExistingExercise = () => {
    if (!selectedExerciseId) return alert("Seleziona un esercizio");

    const ex = allExercises.find((e) => e._id === selectedExerciseId);
    if (!ex) return;

    if (!existingWorkoutDetails.sets || !existingWorkoutDetails.reps) {
      return alert("Compila serie e ripetizioni");
    }

    setRoutine((prev) => ({
      ...prev,
      workouts: [
        ...prev.workouts,
        {
          exercise: ex,
          sets: Number(existingWorkoutDetails.sets),
          reps: Number(existingWorkoutDetails.reps),
          weight: Number(existingWorkoutDetails.weight) || 0,
        },
      ],
    }));

    // Reset campi
    setSelectedExerciseId("");
    setExistingWorkoutDetails({ sets: "", reps: "", weight: "" });
    setIsModalOpen(false);
  };

  // 🔹 Aggiungi esercizio nuovo
  const handleAddWorkout = () => {
    if (!newWorkout.exercise.name)
      return alert("Inserisci il nome dell'esercizio");
    if (!newWorkout.sets || !newWorkout.reps)
      return alert("Compila serie e ripetizioni");

    setRoutine((prev) => ({
      ...prev,
      workouts: [...prev.workouts, newWorkout],
    }));

    setNewWorkout({
      exercise: { name: "", muscleGroup: "", equipment: "", description: "" },
      sets: "",
      reps: "",
      weight: "",
    });
    setIsModalOpen(false);
  };

  // 🔹 Rimuovi workout
  const handleRemoveWorkout = (index) => {
    setRoutine((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Aggiorna workout
  const handleUpdateWorkout = (index, updatedWorkout) => {
    setRoutine((prev) => {
      const updatedWorkouts = [...prev.workouts];
      updatedWorkouts[index] = updatedWorkout;
      return { ...prev, workouts: updatedWorkouts };
    });
    setEditingWorkoutIndex(null);
  };

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Torna indietro
      </button>

      <h1 className="text-2xl font-bold mb-4">
        {id === "new" ? "➕ Crea nuova Routine" : `Modifica: ${routine.name}`}
      </h1>

      {/* Info routine */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Nome Routine"
          value={routine.name}
          onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Giorno della settimana"
          value={routine.dayOfWeek}
          onChange={(e) =>
            setRoutine({ ...routine, dayOfWeek: e.target.value })
          }
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Lista workout */}
      <h2 className="text-xl font-semibold mb-3">Workout nella routine</h2>
      {routine.workouts.length === 0 ? (
        <p className="text-gray-600">Nessun esercizio ancora</p>
      ) : (
        <ul className="space-y-3 mb-6">
          {routine.workouts.map((w, i) => (
            <li
              key={i}
              className="bg-gray-100 p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <strong>{w.exercise.name}</strong> – {w.sets}x{w.reps} @{" "}
                {w.weight}kg
                <div className="text-sm text-gray-600">
                  {w.exercise.muscleGroup} | {w.exercise.equipment}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingWorkoutIndex(i)}
                  className="text-yellow-600 hover:underline"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleRemoveWorkout(i)}
                  className="text-red-600 hover:underline"
                >
                  Elimina
                </button>
              </div>

              {/* Form modifica inline */}
              {editingWorkoutIndex === i && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    placeholder="Serie"
                    value={w.sets}
                    onChange={(e) =>
                      handleUpdateWorkout(i, {
                        ...w,
                        sets: Number(e.target.value),
                      })
                    }
                    className="border p-1 rounded w-16"
                  />
                  <input
                    type="number"
                    placeholder="Ripetizioni"
                    value={w.reps}
                    onChange={(e) =>
                      handleUpdateWorkout(i, {
                        ...w,
                        reps: Number(e.target.value),
                      })
                    }
                    className="border p-1 rounded w-16"
                  />
                  <input
                    type="number"
                    placeholder="Peso"
                    value={w.weight}
                    onChange={(e) =>
                      handleUpdateWorkout(i, {
                        ...w,
                        weight: Number(e.target.value),
                      })
                    }
                    className="border p-1 rounded w-20"
                  />
                  <button
                    onClick={() => setEditingWorkoutIndex(null)}
                    className="text-blue-600 hover:underline"
                  >
                    Chiudi
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pulsante per aprire modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-8"
      >
        ➕ Aggiungi esercizio
      </button>

      {/* Modal */}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-lg w-[90%] max-w-lg relative shadow-lg"
            >
              {/* Bottone chiudi */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-3 text-gray-600 hover:text-black"
              >
                ✖
              </button>

              <h3 className="text-lg font-semibold mb-4">
                Aggiungi esercizio alla routine
              </h3>

              {/* Tabs */}
              <div className="flex mb-4 border-b">
                <button
                  className={`flex-1 p-2 ${
                    activeTab === "existing"
                      ? "border-b-2 border-green-600"
                      : ""
                  }`}
                  onClick={() => setActiveTab("existing")}
                >
                  Esercizio esistente
                </button>
                <button
                  className={`flex-1 p-2 ${
                    activeTab === "new" ? "border-b-2 border-green-600" : ""
                  }`}
                  onClick={() => setActiveTab("new")}
                >
                  Nuovo esercizio
                </button>
              </div>

              {/* Contenuto tab */}
              {activeTab === "existing" ? (
                <>
                  <select
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                  >
                    <option value="">-- Seleziona un esercizio --</option>
                    {allExercises.map((ex) => (
                      <option key={ex._id} value={ex._id}>
                        {ex.name} ({ex.muscleGroup})
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <input
                      type="number"
                      placeholder="Serie"
                      value={existingWorkoutDetails.sets}
                      onChange={(e) =>
                        setExistingWorkoutDetails({
                          ...existingWorkoutDetails,
                          sets: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Ripetizioni"
                      value={existingWorkoutDetails.reps}
                      onChange={(e) =>
                        setExistingWorkoutDetails({
                          ...existingWorkoutDetails,
                          reps: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Peso (kg)"
                      value={existingWorkoutDetails.weight}
                      onChange={(e) =>
                        setExistingWorkoutDetails({
                          ...existingWorkoutDetails,
                          weight: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                  </div>
                  <button
                    onClick={handleAddExistingExercise}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                  >
                    ➕ Aggiungi
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Nome esercizio"
                    value={newWorkout.exercise.name}
                    onChange={(e) =>
                      setNewWorkout({
                        ...newWorkout,
                        exercise: {
                          ...newWorkout.exercise,
                          name: e.target.value,
                        },
                      })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Gruppo muscolare"
                    value={newWorkout.exercise.muscleGroup}
                    onChange={(e) =>
                      setNewWorkout({
                        ...newWorkout,
                        exercise: {
                          ...newWorkout.exercise,
                          muscleGroup: e.target.value,
                        },
                      })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Attrezzatura"
                    value={newWorkout.exercise.equipment}
                    onChange={(e) =>
                      setNewWorkout({
                        ...newWorkout,
                        exercise: {
                          ...newWorkout.exercise,
                          equipment: e.target.value,
                        },
                      })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <input
                      type="number"
                      placeholder="Serie"
                      value={newWorkout.sets}
                      onChange={(e) =>
                        setNewWorkout({
                          ...newWorkout,
                          sets: Number(e.target.value),
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Ripetizioni"
                      value={newWorkout.reps}
                      onChange={(e) =>
                        setNewWorkout({
                          ...newWorkout,
                          reps: Number(e.target.value),
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Peso (kg)"
                      value={newWorkout.weight}
                      onChange={(e) =>
                        setNewWorkout({
                          ...newWorkout,
                          weight: Number(e.target.value),
                        })
                      }
                      className="border p-2 rounded"
                    />
                  </div>
                  <button
                    onClick={handleAddWorkout}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                  >
                    ➕ Aggiungi nuovo esercizio
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          💾 Salva Routine
        </button>
      </div>
    </div>
  );
}

export default RoutineDetail;
