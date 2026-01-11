import { useState } from "react";
import toast from "react-hot-toast";

export default function Admission() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      Object.entries(files).forEach(([k, v]) => data.append(k, v));

      const res = await fetch("http://localhost:5000/api/admissions", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Submission failed");

      toast.success("Application submitted successfully!");
      setForm({ name: "", email: "", phone: "", course: "" });
      setFiles({});
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10 animate-pageFade">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-6xl
          bg-white
          rounded-2xl
          shadow-xl
          border border-slate-200
          p-10
          space-y-8
          animate-cardRise
        "
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Admission Application
          </h1>
          <p className="text-slate-600 mt-2 text-base">
            Please fill in your details carefully. All fields are required.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", name: "name" },
            { label: "Email Address", name: "email" },
            { label: "Phone Number", name: "phone" },
            { label: "Course Applied For", name: "course" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field.label}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="
                  w-full rounded-lg
                  border border-slate-300
                  px-4 py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-slate-900/20
                  transition
                "
              />
            </div>
          ))}
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Marksheet", name: "marksheet" },
            { label: "ID Proof", name: "idProof" },
            { label: "Photograph", name: "photo" },
          ].map((file) => (
            <div key={file.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {file.label}
              </label>
              <input
                type="file"
                name={file.name}
                onChange={handleFile}
                required
                className="
                  block w-full text-sm text-slate-500
                  file:mr-3 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-slate-100 file:text-slate-700
                  hover:file:bg-slate-200
                  transition
                "
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            disabled={loading}
            className={`
              w-full py-4 rounded-xl
              font-medium text-base
              text-white transition
              ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
              }
            `}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
