import { useState } from "react";

export default function Admission() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const [documents, setDocuments] = useState({
    marksheet: null,
    idProof: null,
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments({ ...documents, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      Object.entries(documents).forEach(([k, v]) => formData.append(k, v));

      const res = await fetch("http://localhost:5000/api/admissions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSubmitted(true);
    } catch (err) {
      alert(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <h2>🎉 Application submitted successfully</h2>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="course" placeholder="Course" onChange={handleChange} required />

      <input type="file" name="marksheet" onChange={handleFileChange} required />
      <input type="file" name="idProof" onChange={handleFileChange} required />
      <input type="file" name="photo" onChange={handleFileChange} required />

      <button disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
