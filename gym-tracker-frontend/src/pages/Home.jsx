import { useEffect, useState } from "react";
import WorkoutForm from "../components/WorkoutForm.jsx";

function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ name: "", sets: 0, reps: 0, weight: 0 });

  const API_URL = import.meta.env.VITE_API_URL;

  // Carica i workout dal backend
  const fetchWorkouts = async () => {
    try {
      const res = await fetch(`${API_URL}/workouts`);
      const data = await res.json();
      setWorkouts(data);
    } catch (error) {
      console.error("Errore nel recupero:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Aggiungi un nuovo workout alla lista
  const addWorkout = (workout) => {
    setWorkouts((prev) => [workout, ...prev]);
  };

  // Elimina un workout
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/workouts/${id}`, { method: "DELETE" });
      if (res.ok) setWorkouts((prev) => prev.filter((w) => w._id !== id));
      else console.error("Errore nella cancellazione");
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  // Inizia la modifica di un workout
  const startEditing = (workout) => {
    setEditingId(workout._id);
    setEditFields({ ...workout });
  };

  // Salva le modifiche
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/workouts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFields),
      });
      const data = await res.json();
      if (res.ok) {
        setWorkouts((prev) => prev.map((w) => (w._id === id ? data : w)));
        setEditingId(null);
      } else {
        console.error("Errore nell'aggiornamento", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Form aggiunta workout */}
      <WorkoutForm onAdd={addWorkout} />

      <h1 className="text-2xl font-bold mb-4 text-center">🏋️‍♂️ I tuoi allenamenti</h1>

      {workouts.length === 0 ? (
        <p className="text-center text-gray-600">Com’è vuoto...</p>
      ) : (
        <ul className="space-y-2">
          {workouts.map((w) => (
            <li
              key={w._id}
              className="bg-gray-100 p-3 rounded-md shadow-sm flex justify-between items-center"
            >
              {editingId === w._id ? (
                // FORM inline per modifica
                <div className="flex flex-wrap gap-2 items-center w-full">
                  <input
                    value={editFields.name}
                    onChange={(e) =>
                      setEditFields({ ...editFields, name: e.target.value })
                    }
                    className="border rounded-md p-1 flex-1"
                  />
                  <input
                    type="number"
                    value={editFields.sets}
                    onChange={(e) =>
                      setEditFields({ ...editFields, sets: Number(e.target.value) })
                    }
                    className="border rounded-md p-1 w-16"
                  />
                  <input
                    type="number"
                    value={editFields.reps}
                    onChange={(e) =>
                      setEditFields({ ...editFields, reps: Number(e.target.value) })
                    }
                    className="border rounded-md p-1 w-16"
                  />
                  <input
                    type="number"
                    value={editFields.weight}
                    onChange={(e) =>
                      setEditFields({ ...editFields, weight: Number(e.target.value) })
                    }
                    className="border rounded-md p-1 w-16"
                  />
                  <button
                    onClick={() => handleUpdate(w._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Annulla
                  </button>
                </div>
              ) : (
                // Visualizzazione normale
                <>
                  <div>
                    <strong className="text-lg">{w.name}</strong>
                    <div className="text-gray-600 text-sm">
                      {w.sets} serie × {w.reps} ripetizioni
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{w.weight} kg</span>
                    <button
                      onClick={() => startEditing(w)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-sm"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => handleDelete(w._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-sm"
                    >
                      Elimina
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
