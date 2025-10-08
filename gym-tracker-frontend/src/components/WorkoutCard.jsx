function WorkoutCard({ workout }) {
  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <h4 className="font-bold text-lg">{workout.exercise.name}</h4>
      <p>{workout.sets} serie x {workout.reps} ripetizioni</p>
      <p className="font-semibold">{workout.weight} kg</p>
    </div>
  );
}

export default WorkoutCard;
