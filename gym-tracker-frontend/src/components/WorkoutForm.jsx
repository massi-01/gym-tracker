import { useState } from "react";

function WorkoutForm({ onAdd }) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWorkout = {name, sets: Number(sets), reps: Number(reps), weight: Number(weight)}; 

    try{
      const res = await fetch(`${API_URL}/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkout),
      });
      const data = await res.json();
      // Se la risposta contiene "data", usa quella
      const savedWorkout = data.data || data;
      onAdd(savedWorkout);
    } catch(error){
      console.error("Errore di rete", err); 
    }
  }
  return (
    <form
      onSubmit={handleSubmit} 
      className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Aggiungi un allenamento 💪
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Esercizio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-md p-2"
          required
        />
        <input
          type="number"
          placeholder="Serie"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          className="border rounded-md p-2"
          required
        />
        <input
          type="number"
          placeholder="Ripetizioni"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="border rounded-md p-2"
          required
        />
        <input
          type="number"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border rounded-md p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
      >
        Aggiungi
      </button>
    </form>
  );
}

export default WorkoutForm; 