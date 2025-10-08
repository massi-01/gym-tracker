import { useEffect, useState } from "react";
import ExerciseForm from "../components/ExerciseForm.jsx";

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({
    name: "",
    muscleGroup: "",
    equipment: "",
    description: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // 📥 Carica esercizi dal backend
  const fetchExercises = async () => {
    try {
      const res = await fetch(`${API_URL}/exercises`);
      const data = await res.json();
      setExercises(data);
    } catch (error) {
      console.error("Errore nel recupero esercizi:", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // ➕ Aggiungi nuovo esercizio
  const addExercise = (exercise) => {
    setExercises((prev) => [exercise, ...prev]);
  };

  // ❌ Elimina esercizio
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/exercises/${id}`, { method: "DELETE" });
      if (res.ok) setExercises((prev) => prev.filter((e) => e._id !== id));
      else console.error("Errore nella cancellazione");
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  // ✏️ Inizia modifica
  const startEditing = (exercise) => {
    setEditingId(exercise._id);
    setEditFields({ ...exercise });
  };

  // 💾 Salva modifiche
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/exercises/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFields),
      });

      const data = await res.json();

      if (res.ok) {
        setExercises((prev) =>
          prev.map((e) => (e._id === id ? data : e))
        );
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
      <ExerciseForm onAdd={addExercise} />

      <h1 className="text-2xl font-bold mb-4 text-center">
        🏋️‍♂️ I tuoi esercizi
      </h1>

      {exercises.length === 0 ? (
        <p className="text-center text-gray-600">Nessun esercizio salvato.</p>
      ) : (
        <ul className="space-y-2">
          {exercises.map((e) => (
            <li
              key={e._id}
              className="bg-gray-100 p-3 rounded-md shadow-sm flex justify-between items-center"
            >
              {editingId === e._id ? (
                <div className="flex flex-wrap gap-2 items-center w-full">
                  <input
                    value={editFields.name}
                    onChange={(ev) =>
                      setEditFields({ ...editFields, name: ev.target.value })
                    }
                    className="border rounded-md p-1 flex-1"
                  />
                  <input
                    value={editFields.muscleGroup}
                    onChange={(ev) =>
                      setEditFields({ ...editFields, muscleGroup: ev.target.value })
                    }
                    className="border rounded-md p-1 flex-1"
                  />
                  <input
                    value={editFields.equipment}
                    onChange={(ev) =>
                      setEditFields({ ...editFields, equipment: ev.target.value })
                    }
                    className="border rounded-md p-1 flex-1"
                  />
                  <input
                    value={editFields.description}
                    onChange={(ev) =>
                      setEditFields({ ...editFields, description: ev.target.value })
                    }
                    className="border rounded-md p-1 flex-1"
                  />
                  <button
                    onClick={() => handleUpdate(e._id)}
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
                <>
                  <div>
                    <strong className="text-lg">{e.name}</strong>
                    <div className="text-gray-600 text-sm">
                      {e.muscleGroup} • {e.equipment || "Nessuna attrezzatura"}
                    </div>
                    {e.description && (
                      <p className="text-sm text-gray-500">{e.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(e)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-sm"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
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

export default Exercises;
