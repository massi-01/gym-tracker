import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Routine from "./pages/Routine.jsx";
import Exercises from "./pages/Exercises.jsx";
import RoutineDetail from "./pages/RoutineDetail.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/routine" element={<Routine />} />
        {/* se volessi un redirect automatico */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/routines/:id" element={<RoutineDetail />} />
        <Route path="/routines/new" element={<RoutineDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
