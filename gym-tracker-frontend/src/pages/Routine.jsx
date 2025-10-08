import { useEffect, useState } from "react";
import RoutineForm from "../components/RoutineForm.jsx";

function Routine() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch(`${API_URL}/routines`);
        const data = await res.json();
        setRoutines(data.data || data); // dipende da come il backend ritorna
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoutines();
  }, []);

  const addRoutine = (routine) => {
    setRoutines((prev) => [routine, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/routines/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRoutines((prev) => prev.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <RoutineForm onAdd={addRoutine} API_URL={API_URL} />
      <h1 className="text-2xl font-bold mb-4">🗓 Le tue routine</h1>

      {routines.length === 0 ? (
        <p className="text-gray-600 text-center">Nessuna routine ancora</p>
      ) : (
        <ul className="space-y-2">
          {routines.map(r => (
            <li key={r._id} className="bg-gray-100 p-3 rounded-md flex justify-between items-center">
              <div>
                <strong>{r.name}</strong> - {r.dayOfWeek}
                <ul className="ml-4 text-gray-700">
                  {r.workouts.map(w => (
                    <li key={w._id}>{w.name} ({w.sets}x{w.reps} {w.weight}kg)</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleDelete(r._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Routine;
