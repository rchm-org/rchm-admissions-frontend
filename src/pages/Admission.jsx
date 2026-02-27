import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const COURSES = [
  "Diploma in Hospitality Management",
  "Craftsmanship in Hospitality Management",
];

const Admission = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      if (file) payload.append("documents", file);

      await api.post("/admissions", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Admission submitted successfully!");
      setFormData({ name: "", email: "", phone: "", course: "" });
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to submit. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Admission Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              pattern="[0-9+\-\s]{7,15}"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="course"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select a course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Document upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Supporting Document{" "}
              <span className="text-slate-400 text-xs">(PDF, JPG, PNG — max 2MB)</span>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition
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