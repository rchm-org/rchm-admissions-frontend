import { useState } from "react";
import { API_BASE } from "../utils/api";

export default function Admission() {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    Object.entries(files).forEach(([k, v]) => data.append(k, v));

    try {
      const res = await fetch(`${API_BASE}/api/admissions`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error();
      alert("Application submitted");
    } catch {
      setError("Failed to submit application");
    }
  };

  return <form onSubmit={handleSubmit}>{error}</form>;
}
