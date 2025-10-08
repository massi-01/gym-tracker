import { useEffect, useState } from "react";

function RoutineForm({ onAdd, API_URL }) {
  const [name, setName] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Lunedì");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`${API_URL}/workouts`);
        const data = await res.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Errore nel recupero dei workout:", error);
      }
    };
    fetchWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || selectedWorkouts.length === 0) return;

    const res = await fetch(`${API_URL}/routines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        dayOfWeek,
        workouts: selectedWorkouts, // invia array di id
      }),
    });

    const data = await res.json();
    onAdd(data); // aggiorna lista nel parent
    setName("");
    setSelectedWorkouts([]);
  };

  const handleSelectWorkout = (id) => {
    setSelectedWorkouts((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-100 rounded-md">
      <h2 className="text-lg font-bold mb-2">Crea Routine</h2>

      <input
        type="text"
        placeholder="Nome routine"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />

      <select
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      >
        {["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"].map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <div className="mb-2">
        <p className="font-semibold">Seleziona workout:</p>
        {workouts.map((w) => (
          <label key={w._id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedWorkouts.includes(w._id)}
              onChange={() => handleSelectWorkout(w._id)}
            />
            {w.name} ({w.sets}x{w.reps} {w.weight}kg)
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        Salva Routine
      </button>
    </form>
  );
}

export default RoutineForm;
