import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmissionModal from "../components/AdmissionModal";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/Skeleton";
import toast from "react-hot-toast";
import { API_BASE } from "../api"; // ✅ IMPORTANT

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
        const res = await fetch(
          `${API_BASE}/api/admin/admissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load admissions");
        }

        const data = await res.json();
        setAdmissions(data);
      } catch (err) {
        console.error("Admin fetch error:", err);
        setError("Failed to fetch admissions");
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

        <div className="space-y-4">
          {finalList.map((a) => (
            <div key={a._id} className="bg-white rounded-xl border p-5">
              <h3 className="font-medium">{a.name}</h3>
              <p className="text-sm text-slate-600">{a.phone}</p>
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
