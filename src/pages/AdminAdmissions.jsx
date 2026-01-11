import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmissionModal from "../components/AdmissionModal";
import { useAuth } from "../context/AuthContext";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [view, setView] = useState("inbox"); // inbox | archived

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // 🔄 Fetch admissions on load (AUTHENTICATED)
  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/admissions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // 🔁 Update admission in list (called by modal)
  const handleStatusUpdate = (updatedAdmission) => {
    setAdmissions((prev) =>
      prev.map((a) =>
        a._id === updatedAdmission._id ? updatedAdmission : a
      )
    );
    setSelectedAdmission(null);
  };

  // 🔍 Filter logic
  const filteredAdmissions = admissions.filter((a) => {
    if (view === "archived") return a.status === "closed";
    return a.status !== "closed";
  });

  // 🔒 Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p>Loading admissions…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      {/* 🔝 HEADER */}
      <div style={headerStyle}>
        <h1>Admissions Inbox</h1>
        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      {/* 🔘 FILTER BUTTONS */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setView("inbox")}
          style={{
            marginRight: "10px",
            padding: "8px 14px",
            background: view === "inbox" ? "#2c3e50" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Inbox
        </button>

        <button
          onClick={() => setView("archived")}
          style={{
            padding: "8px 14px",
            background: view === "archived" ? "#2c3e50" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Archived
        </button>
      </div>

      {/* 📋 TABLE */}
      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredAdmissions.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No admissions found
              </td>
            </tr>
          ) : (
            filteredAdmissions.map((a) => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.course}</td>
                <td>{a.phone}</td>
                <td>{a.status}</td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => setSelectedAdmission(a)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔍 MODAL */}
      <AdmissionModal
        admission={selectedAdmission}
        onClose={() => setSelectedAdmission(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

/* styles */
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const logoutBtn = {
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  cursor: "pointer",
};
