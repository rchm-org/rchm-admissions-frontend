import { Routes, Route } from "react-router-dom";
import Admission from "./pages/Admission";

export default function App() {
  return (
    <Routes>
      <Route path="/admission" element={<Admission />} />
    </Routes>
  );
}
