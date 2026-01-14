import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE } from "../utils/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const COURSES = [
  "Diploma in Hospitality Management",
  "Craftsmanship Certificate in Hotel Management",
];

export default function Admission() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseFromURL = params.get("course");
    if (COURSES.includes(courseFromURL)) {
      setForm((p) => ({ ...p, course: courseFromURL }));
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔐 PHONE: digits only, max 10
  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "") // remove non-digits
      .slice(0, 10);      // cap at 10 digits

    setForm((prev) => ({ ...prev, phone: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((p) => ({ ...p, [e.target.name]: file }));

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () =>
        setPreviews((p) => ({ ...p, [e.target.name]: reader.result }));
      reader.readAsDataURL(file);
    } else {
      setPreviews((p) => ({ ...p, [e.target.name]: file.name }));
    }
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!emailRegex.test(form.email)) e.email = "Invalid email address";
    if (!phoneRegex.test(form.phone))
      e.phone = "Mobile number must be exactly 10 digits";
    if (!COURSES.includes(form.course))
      e.course = "Please select a valid course";

    ["marksheet", "idProof", "photo"].forEach((f) => {
      if (!files[f]) e[f] = "Required";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    setLoading(true);
    setProgress(0);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    Object.entries(files).forEach(([k, v]) => data.append(k, v));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/api/admissions`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status !== 201 && xhr.status !== 200) {
          throw new Error(res.message);
        }
        setReferenceId(res.referenceId);
        setSubmitted(true);
        toast.success("Application submitted successfully");
      } catch (err) {
        toast.error(err.message || "Submission failed");
      } finally {
        setLoading(false);
      }
    };

    xhr.onerror = () => {
      toast.error("Upload failed");
      setLoading(false);
    };

    xhr.send(data);
  };

  /* ================= SUCCESS ================= */
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white max-w-2xl w-full p-12 rounded-2xl shadow-xl text-center animate-slideUpFade">
          <h1 className="text-2xl font-semibold">🎉 Application Submitted</h1>
          <p className="mt-4 text-slate-600">
            Your reference ID
            <span className="block mt-2 font-mono text-lg font-semibold">
              {referenceId}
            </span>
          </p>
          <div className="mt-8 flex gap-4 justify-center">
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

  /* ================= FORM ================= */
  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-slate-50 flex items-center justify-center p-8"
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-10 space-y-8 animate-fadeIn">
        <h1 className="text-3xl font-semibold text-center">
          Admission Application
        </h1>

        <section>
          <h2 className="text-lg font-medium mb-4">
            Applicant Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
            <Input label="Email Address" name="email" value={form.email} onChange={handleChange} error={errors.email} />

            {/* 🔐 MOBILE NUMBER */}
            <Input
              label="Mobile Number"
              name="phone"
              value={form.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              inputMode="numeric"
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
            />

            {/* COURSE */}
            <div>
              <label className="text-sm font-medium">Course Applied For</label>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  errors.course ? "border-red-400" : "border-slate-300"
                }`}
              >
                <option value="">Select a course</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="text-xs text-red-500 mt-1">{errors.course}</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-4">Required Documents</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <FileInput label="Marksheet" name="marksheet" onChange={handleFile} preview={previews.marksheet} error={errors.marksheet} />
            <FileInput label="ID Proof" name="idProof" onChange={handleFile} preview={previews.idProof} error={errors.idProof} />
            <FileInput label="Photograph" name="photo" onChange={handleFile} preview={previews.photo} error={errors.photo} />
          </div>
        </section>

        {loading && (
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 text-center">
              Uploading… {progress}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-8 py-4 rounded-xl bg-slate-900 text-white text-lg hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Apply for Admission"}
        </button>
      </div>
    </form>
  );
}

/* ============ SMALL COMPONENTS ============ */

function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className={`mt-1 w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function FileInput({ label, preview, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type="file" {...props} className="mt-1 w-full text-sm" />
      {preview && (
        <div className="mt-2">
          {preview.startsWith("data:image") ? (
            <img src={preview} alt="preview" className="h-24 rounded-md object-cover" />
          ) : (
            <p className="text-xs text-slate-600">{preview}</p>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
