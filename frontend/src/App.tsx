import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { RideConfirmation } from "./pages/RideConfirmation";
import "./App.css";
import { RideHistory } from "./pages/RideHistory";

function App() {  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ride/confirm" element={<RideConfirmation />} />
        <Route path="/ride/history/:customer_id" element={<RideHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
