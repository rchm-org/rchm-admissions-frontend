import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admission from "./pages/Admission";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admission" element={<Admission />} />
    </Routes>
  );
}
