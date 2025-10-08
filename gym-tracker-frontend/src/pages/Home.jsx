import { useEffect, useState } from "react";
import WorkoutCard from "../components/WorkoutCard.jsx";

function Home() {
  const [workouts, setWorkouts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`${API_URL}/workouts`);
        const data = await res.json();
        // prendo solo gli ultimi 3 inseriti
        setWorkouts((data.data || data).slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Benvenuto su Gym Tracker 💪</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Ultimi workout</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workouts.map(w => (
            <WorkoutCard key={w._id} workout={w} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Statistiche</h3>
        <p className="text-gray-600">Qui potremo mostrare statistiche dei workout (es. volume totale, progressi ecc.)</p>
      </section>
    </div>
  );
}

export default Home;
