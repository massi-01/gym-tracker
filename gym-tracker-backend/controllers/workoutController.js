import { Workout } from "../models/workoutModels.js";

//GET: restituisce tutti gli allenamenti
export const getWorkouts = async (req, res) => {
    try{
        const workouts = await Workout.find().sort({createdAt: -1});
        res.status(200).json(workouts); 
    } catch(error) {
        res.status(500).json({message: "Errore while retrieving workouts"}); 
    }
}; 

//POST: Aggiunge un allenamento
export const createWorkout = async (req, res) => {
    try{
        const {name, sets, reps, weight} = req.body; 
        const newWorkout = new Workout({name, sets, reps, weight}); 
        await newWorkout.save(); 
        res.status(201).json(newWorkout); 
    } catch (error){
        res.status(500).json({message: "Errore while saving workouts"}); 
    }
}; 

//PUT: Aggiorna un allenamento
export const updateWorkout = async (req, res) => {
    try{
        const {id} = req.params; 
        const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, {new: true}); 
        res.status(200).json(updatedWorkout);  
    } catch (error) {
        res.status(400).json({message: "Error while updating"}); 
    }
}; 

//DELETE: elimina un allenamento
export const deleteWorkout = async (req, res) =>{
    try{
        const {id} = req.params; 
        await Workout.findByIdAndDelete(id); 
        res.status(204).send(); 
    } catch (error) {
        res.status(400).json({message: "Error while deleting"}); 
    }
}; 


/*
    DOMANDE DA FARE: 
    Che significa export come parola chiave?
    Perché quando recupera i valori dalla richiesta, le variabili sono tra parentesi graffe? es. const {id}, const {name, sets, reps, weight}
    Gli oggetti sono stati inseriti nel db con un id, come è stato generato? 
*/