import { useState } from "react";

function ExerciseForm({ onAdd }) {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [equipment, setEquipment] = useState("");
  const [description, setDescription] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExercise = { name, muscleGroup, equipment, description };

    try {
      const res = await fetch(`${API_URL}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExercise),
      });

      if (!res.ok) {
        throw new Error("Errore durante la creazione dell’esercizio");
      }

      const data = await res.json();
      const savedExercise = data.data || data;

      onAdd(savedExercise);

      // Reset campi
      setName("");
      setMuscleGroup("");
      setEquipment("");
      setDescription("");
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Aggiungi un esercizio 💪
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nome esercizio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-md p-2"
          required
        />
        <input
          type="text"
          placeholder="Gruppo muscolare"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          className="border rounded-md p-2"
          required
        />
        <input
          type="text"
          placeholder="Attrezzatura"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          className="border rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Descrizione"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
      >
        Aggiungi esercizio
      </button>
    </form>
  );
}

export default ExerciseForm;
