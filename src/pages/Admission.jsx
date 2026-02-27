import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const COURSES = [
  "Diploma in Hospitality Management",
  "Craftsmanship in Hospitality Management",
];

const FILE_FIELDS = [
  {
    key: "marksheet",
    label: "Marksheet",
    hint: "10th / 12th marksheet (PDF, JPG, PNG — max 2 MB)",
  },
  {
    key: "idDocument",
    label: "Identity Document",
    hint: "Aadhaar / PAN Card / Driving Licence (PDF, JPG, PNG — max 2 MB)",
  },
  {
    key: "photograph",
    label: "Passport Photograph",
    hint: "Recent passport-size photo (JPG, PNG — max 2 MB)",
  },
];

const Admission = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", course: "",
  });
  const [files, setFiles] = useState({
    marksheet: null, idDocument: null, photograph: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (key) => (e) =>
    setFiles({ ...files, [key]: e.target.files[0] || null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      Object.entries(files).forEach(([k, v]) => { if (v) payload.append(k, v); });

      await api.post("/admissions", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully!");
      setFormData({ name: "", email: "", phone: "", course: "" });
      setFiles({ marksheet: null, idDocument: null, photograph: null });
      e.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">
          Admission Application
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Fill in all required fields and upload your documents to apply.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Text fields */}
          {[
            { name: "name", label: "Full Name", type: "text", placeholder: "Enter your full name" },
            { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter your phone number", pattern: "[0-9+\\-\\s]{7,15}" },
          ].map(({ name, label, type, placeholder, pattern }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                pattern={pattern}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          ))}

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Select a course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Document uploads */}
          <div className="pt-1">
            <p className="text-sm font-medium text-slate-700 mb-3">Documents</p>
            <div className="space-y-4">
              {FILE_FIELDS.map(({ key, label, hint }) => (
                <div key={key} className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <label className="block text-sm font-medium text-slate-800 mb-0.5">
                    {label}
                  </label>
                  <p className="text-xs text-slate-500 mb-2">{hint}</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange(key)}
                    className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                  />
                  {files[key] && (
                    <p className="text-xs text-emerald-600 mt-1.5">
                      ✓ {files[key].name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition mt-2
              ${submitting
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800"
              }`}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admission;