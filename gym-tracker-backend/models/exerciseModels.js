import mongoose from "mongoose"; 

const exerciseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  muscleGroup: {type: String, required: true}, 
  equipment: {type: String}, 
  description: {type: String} 
}); 

const Exercise = mongoose.model("Exercise", exerciseSchema); 
export default Exercise; 