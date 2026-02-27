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
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (key) => (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFiles((prev) => ({ ...prev, [key]: null }));
      return;
    }

    if (key === "photograph" && file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        if (img.width > img.height) {
          toast.error("Photograph must be in portrait orientation (taller than it is wide).");
          e.target.value = ""; // Reset input
          setFiles((prev) => ({ ...prev, [key]: null }));
        } else {
          setFiles((prev) => ({ ...prev, [key]: file }));
        }
      };
      img.src = URL.createObjectURL(file);
    } else {
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim().length === 10 &&
    formData.course.trim() !== "" &&
    files.marksheet !== null &&
    files.idDocument !== null &&
    files.photograph !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      Object.entries(files).forEach(([k, v]) => { if (v) payload.append(k, v); });

      const res = await api.post("/admissions", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully!");
      setSuccessData({
        pdfUrl: res.data.applicationPdf,
        name: res.data.name,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg mb-4">
          <a
            href="https://www.rchm.org.in"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4 border-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Website
          </a>
        </div>
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg p-10 text-center animate-cardRise border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Thank you, {successData.name.split(" ")[0]}. Your application has been received successfully. Our admissions team will review it shortly.
          </p>

          {successData.pdfUrl && (
            <a
              href={successData.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full mb-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF Receipt
            </a>
          )}

          <button
            onClick={() => {
              setFormData({ name: "", email: "", phone: "", course: "" });
              setFiles({ marksheet: null, idDocument: null, photograph: null });
              setSuccessData(null);
            }}
            className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors py-2"
          >
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg mb-4">
        <a
          href="https://www.rchm.org.in"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4 border-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </a>
      </div>
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
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit mobile number", pattern: "[0-9]{10}", maxLength: 10 },
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
            disabled={submitting || !isFormValid}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition mt-2
              ${(submitting || !isFormValid)
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