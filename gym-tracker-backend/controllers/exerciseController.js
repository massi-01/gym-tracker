import Exercise from "../models/exerciseModels.js"; 

//GET: Restituisce tutti gli esercizi
export const getExercise = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({createdAt: -1});
    res.status(200).json(exercises); 
  } catch (error) {
    res.status(500).json({message: "Error while retrieving exercises: " + error.message}); 
  }
};

//POST: Aggiunge un esercizio
export const createExercise = async (req, res) => {
  try {
    const {name, muscleGroup, equipment, description} = req.body; 
    const newExercise = new Exercise({name, muscleGroup, equipment, description}); 
    await newExercise.save(); 
    res.status(201).json(newExercise);

  } catch (error) {
    res.status(500).json({message: "Error while saving exercises: " + error.message}); 
  }
};

//PUT: Aggiorna un esercizio
export const updateExercise = async (req, res) => {
  try {
    const {id} = req.params; 
    const updatedExercise = await Exercise.findByIdAndUpdate(id, req.body, {new : true}); 
    res.status(200).json(updatedExercise);
  } catch (error) {
    res.status(400).json({message: "Error while updating exercise: " + error.message})
  }
}; 
//DELETE: Elimina un esercizio
export const deleteExercise = async (req, res) => {
  try {
    const {id} = req.params; 
    await Exercise.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({message: "Error while deleting exercise: " + error.message}); 
  }
}; 