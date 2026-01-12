import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmissionModal from "../components/AdmissionModal";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/Skeleton";
import toast from "react-hot-toast";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [view, setView] = useState("inbox");

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/admissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");

        setAdmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [token]);

  const handleStatusUpdate = (updated) => {
    setAdmissions((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );
    setSelectedAdmission(null);
  };

  const handleCopy = async (ref) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedId(ref);
      toast.success("Reference ID copied");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSearch = () => setSearchQuery(searchInput.trim());

  const filtered = admissions.filter((a) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      a.name?.toLowerCase().includes(q) ||
      a.phone?.toLowerCase().includes(q) ||
      a.referenceId?.toLowerCase().includes(q);

    const created = new Date(a.createdAt);
    const matchesFrom = !fromDate || created >= new Date(fromDate);
    const matchesTo = !toDate || created <= new Date(`${toDate}T23:59:59`);

    const matchesCourse =
      courseFilter === "all" || a.course === courseFilter;

    return matchesSearch && matchesFrom && matchesTo && matchesCourse;
  });

  const finalList = filtered.filter((a) => {
    if (view === "approved") return a.status === "approved";
    if (view === "archived") return a.status === "archived";
    return a.status === "pending" || a.status === "contacted";
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-8 w-64" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-slate-600">Manage admission applications</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["inbox", "approved", "archived"].map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${view === t
                ? "bg-slate-900 text-white"
                : "bg-white border text-slate-700"
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Name / Phone / Ref ID"
            className="border px-3 py-2 rounded-lg text-sm"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All Courses</option>
            <option value="Diploma in Hospitality Management">
              Diploma in Hospitality Management
            </option>
            <option value="Craftsmanship in Hospitality Management">
              Craftsmanship in Hospitality Management
            </option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
          >
            Search
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {finalList.map((a) => (
            <div key={a._id} className="bg-white rounded-xl border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{a.name}</h3>
                  <p className="text-sm text-slate-600">{a.phone}</p>

                  {a.referenceId && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-slate-500">
                        Ref: {a.referenceId}
                      </span>
                      <button
                        onClick={() => handleCopy(a.referenceId)}
                        className="text-xs px-2 py-0.5 border rounded"
                      >
                        {copiedId === a.referenceId ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-slate-500 mt-1">{a.course}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold capitalize
                   rounded-full whitespace-nowrap
                    ${a.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : a.status === "archived"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {a.status}
                </span>


              </div>

              <button
                onClick={() => setSelectedAdmission(a)}
                className="mt-3 text-sm underline"
              >
                View details
              </button>
            </div>
          ))}
        </div>

        <AdmissionModal
          admission={selectedAdmission}
          onClose={() => setSelectedAdmission(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}
