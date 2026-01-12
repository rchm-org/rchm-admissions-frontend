import { useState, useEffect } from "react";
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
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  /* 🔗 Preselect course from URL */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseFromURL = params.get("course");
    if (courseFromURL) {
      setForm((prev) => ({ ...prev, course: courseFromURL }));
    }
  }, []);

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

      const result = await res.json();
      if (!res.ok) throw new Error();

      setReferenceId(result.referenceId);
      toast.success("Application submitted successfully!");
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ CONFIRMATION SCREEN */
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white max-w-xl w-full p-10 rounded-2xl shadow-xl text-center">
          <div className="text-5xl mb-4">✅</div>

          <h1 className="text-2xl font-semibold text-slate-900">
            Application Submitted
          </h1>

          <p className="text-slate-600 mt-3">
            Thank you for applying to{" "}
            <span className="font-medium">
              Royal College of Hospitality &amp; Management
            </span>.
          </p>

          {/* 📌 Reference ID */}
          <div className="mt-6 bg-slate-100 border border-slate-300 rounded-xl p-4">
            <p className="text-sm text-slate-600">
              Your Application Reference ID
            </p>
            <p className="text-lg font-mono font-semibold text-slate-900 mt-1">
              {referenceId}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Please save this reference number for future communication.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Submit Another Application
            </button>

            <a
              href="https://rchm.edu.in"
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Back to College Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* 📝 FORM */
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border p-10 space-y-8"
      >
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Admission Application
          </h1>
          <p className="text-slate-600 mt-2">
            Please fill in your details carefully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", name: "name" },
            { label: "Email Address", name: "email" },
            { label: "Phone Number", name: "phone" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1">
                {f.label}
              </label>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">
              Course Applied For
            </label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3 bg-white"
            >
              <option value="">-- Select a course --</option>
              <option value="Diploma in Hospitality Management">
                Diploma in Hospitality Management
              </option>
              <option value="Craftsmanship in Hospitality Management">
                Craftsmanship in Hospitality Management (6 Months)
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Marksheet", name: "marksheet" },
            { label: "ID Proof", name: "idProof" },
            { label: "Photograph", name: "photo" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1">
                {f.label}
              </label>
              <input type="file" name={f.name} onChange={handleFile} required />
            </div>
          ))}
        </div>

        <button
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-medium ${
            loading
              ? "bg-slate-400"
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
