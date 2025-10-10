import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Routine() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [routines, setRoutines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch(`${API_URL}/routines`);
        const data = await res.json();
        setRoutines(data.data || data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoutines();
  }, [API_URL]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/routines/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRoutines((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🗓 Gestisci le tue Routine</h1>
        <button
          onClick={() => navigate("/routines/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          ➕ Nuova Routine
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Le tue routine</h2>
      {routines.length === 0 ? (
        <p className="text-gray-600 text-center">Nessuna routine ancora</p>
      ) : (
        <ul className="space-y-4">
          {routines.map((r) => (
            <li
              key={r._id}
              onClick={() => navigate(`/routines/${r._id}`)}
              className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-200 transition"
            >
              <div>
                <strong className="text-lg">{r.name}</strong> –{" "}
                <span className="text-gray-700">{r.dayOfWeek}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(r._id);
                }}
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
