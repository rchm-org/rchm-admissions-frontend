import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../admin/AdminLayout";
import AdminTabs from "../admin/AdminTabs";
import AdminTable from "../admin/AdminTable";
import AdmissionModal from "../components/AdmissionModal";
import toast from "react-hot-toast";

export default function AdminAdmissions() {
  const { token } = useAuth();

  const [all, setAll] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/admissions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setAll)
      .catch(() => toast.error("Failed to load admissions"))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    return all.filter((a) => {
      const statusMatch = a.status === activeTab;

      const searchMatch =
        !search ||
        [a.name, a.email, a.phone, a.course]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const dateMatch =
        !date || new Date(a.createdAt).toISOString().slice(0, 10) === date;

      return statusMatch && searchMatch && dateMatch;
    });
  }, [all, activeTab, search, date]);

  const handleStatusUpdate = (updated) => {
    setAll((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );
  };

  return (
    <AdminLayout
      search={search}
      setSearch={setSearch}
      date={date}
      setDate={setDate}
    >
      <AdminTabs active={activeTab} onChange={setActiveTab} />

      <AdminTable
        loading={loading}
        data={filtered}
        onRowClick={setSelected}
      />

      <AdmissionModal
        admission={selected}
        onClose={() => setSelected(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </AdminLayout>
  );
}