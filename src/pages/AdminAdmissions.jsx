import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmissionModal from "../components/AdmissionModal";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/Skeleton";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  // tabs
  const [view, setView] = useState("inbox");

  // global filters
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  /* 🔄 Fetch admissions */
  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/admissions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  /* 🔁 Update admission locally */
  const handleStatusUpdate = (updated) => {
    setAdmissions((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );
    setSelectedAdmission(null);
  };

  /* 🔍 GLOBAL SEARCH + DATE FILTER */
  const globallyFiltered = admissions.filter((a) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(q) ||
      a.phone.toLowerCase().includes(q);

    const created = new Date(a.createdAt);

    const matchesFrom =
      !fromDate || created >= new Date(fromDate);

    const matchesTo =
      !toDate ||
      created <= new Date(`${toDate}T23:59:59`);

    return matchesSearch && matchesFrom && matchesTo;
  });

  /* 🧭 Apply tab filter ONLY when no global filters are active */
  const isGlobalFilterActive =
    searchQuery || fromDate || toDate;

  const finalList = isGlobalFilterActive
    ? globallyFiltered
    : globallyFiltered.filter((a) => {
      if (view === "archived") return a.status === "archived";
      if (view === "approved") return a.status === "approved";
      return a.status === "pending" || a.status === "contacted";
    });

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* 🦴 Skeleton */
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">
              Manage admission applications
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["inbox", "approved", "archived"].map((key) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${view === key
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-300 text-slate-700"
                }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Global Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <input
            type="text"
            placeholder="Search name or phone"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
          >
            Search
          </button>
        </div>

        {/* List */}
        {finalList.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-slate-600 border">
            No applications found
          </div>
        ) : (
          <div className="space-y-4">
            {finalList.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-xl border p-5 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{a.name}</h3>
                    <p className="text-sm text-slate-600">{a.phone}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full
                          ${a.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : a.status === "archived"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {a.status}
                  </span>

                </div>

                <button
                  onClick={() => setSelectedAdmission(a)}
                  className="mt-3 text-sm font-medium underline"
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}

        <AdmissionModal
          admission={selectedAdmission}
          onClose={() => setSelectedAdmission(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}
