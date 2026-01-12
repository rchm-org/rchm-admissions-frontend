import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE } from "../utils/api";

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseFromURL = params.get("course");
    if (courseFromURL) {
      setForm((prev) => ({ ...prev, course: courseFromURL }));
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      Object.entries(files).forEach(([k, v]) => data.append(k, v));

      const res = await fetch(`${API_BASE}/api/admissions`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setReferenceId(result.referenceId);
      toast.success("Application submitted successfully");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white max-w-xl w-full p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-semibold">Application Submitted</h1>
          <p className="mt-4 text-slate-600">
            Reference ID:
            <span className="block mt-2 font-mono font-semibold">
              {referenceId}
            </span>
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white"
            >
              Submit Another
            </button>
            <a
              href="https://rchm.edu.in"
              className="px-6 py-3 rounded-xl border"
            >
              Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-center bg-slate-50 p-6"
    >
      {/* form unchanged visually */}
    </form>
  );
}
