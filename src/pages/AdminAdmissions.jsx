import { useEffect, useState } from "react";
import AdmissionModal from "../components/AdmissionModal";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/Skeleton";
import toast from "react-hot-toast";
import { API_BASE } from "../utils/api";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [view, setView] = useState("inbox");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { token, logout } = useAuth();

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/admissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.status === 401) {
          logout();
          toast.error("Session expired. Please login again.");
          return;
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to load admissions");
        }


        setAdmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [token]);

  /* ================= HELPERS ================= */

  const handleCopy = async (ref) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedId(ref);
      toast.success("Reference ID copied");
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      toast.error("Copy failed");
    }
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    toast.success("Logged out");
  };

  /* ================= FILTERING ================= */

  const filteredAdmissions = admissions
    // Global search (overrides tabs)
    .filter((a) => {
      if (!query.trim()) return true;
      const haystack = [
        a?.name,
        a?.email,
        a?.phone,
        a?.referenceId,
        a?.course,
        a?.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query.toLowerCase());
    })
    // Tabs only when search empty
    .filter((a) => {
      if (query.trim()) return true;
      if (view === "approved") return a.status === "approved";
      if (view === "archived") return a.status === "archived";
      return a.status === "pending" || a.status === "contacted";
    })
    // Date filter
    .filter((a) => {
      const created = new Date(a.createdAt);
      if (fromDate && created < new Date(fromDate)) return false;
      if (toDate && created > new Date(`${toDate}T23:59:59`)) return false;
      return true;
    });

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            onClick={() => setShowLogoutModal(true)}
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
              className={`px-4 py-2 rounded-lg text-sm ${view === t
                  ? "bg-slate-900 text-white"
                  : "bg-white border"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 mb-6 grid md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search anything…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border rounded-lg md:col-span-2"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => {
              setQuery("");
              setFromDate("");
              setToDate("");
              setView("inbox");
            }}
            className="px-4 py-2 rounded-lg bg-slate-100"
          >
            Clear
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredAdmissions.length === 0 && (
            <p className="text-center text-slate-500">
              No admissions found
            </p>
          )}

          {filteredAdmissions.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl border p-5"
            >
              <h3 className="font-medium">{a.name}</h3>
              <p className="text-sm text-slate-600">{a.phone}</p>

              {a.referenceId && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono">
                    {a.referenceId}
                  </span>
                  <button
                    onClick={() => handleCopy(a.referenceId)}
                    className="text-xs underline"
                  >
                    {copiedId === a.referenceId ? "Copied" : "Copy"}
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedAdmission(a)}
                className="mt-2 text-sm underline"
              >
                View details
              </button>
            </div>
          ))}
        </div>

        {/* ✅ SAFE AdmissionModal (only renders when admission exists) */}
        {selectedAdmission && (
          <AdmissionModal
            admission={selectedAdmission}
            onClose={() => setSelectedAdmission(null)}
            onStatusUpdate={(updated) =>
              setAdmissions((prev) =>
                prev.map((x) =>
                  x._id === updated._id ? updated : x
                )
              )
            }
          />
        )}

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="font-semibold mb-2">
                Logout confirmation
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Do you want to stay logged in?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded bg-slate-100"
                >
                  Stay
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded bg-red-600 text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
