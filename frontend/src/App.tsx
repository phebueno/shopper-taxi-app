import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { RideConfirmation } from "@/pages/RideConfirmation";
import { RideHistory } from "@/pages/RideHistory";
import "@/App.css";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ride/confirm" element={<RideConfirmation />} />
        <Route path="/ride/history/:customer_id" element={<RideHistory />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
