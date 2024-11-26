import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import RideConfirmation from "./pages/RideConfirmation";
import "./App.css";

function App() {  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ride/confirm" element={<RideConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
