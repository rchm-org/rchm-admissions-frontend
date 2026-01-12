import { useEffect, useState } from "react";
import { API_BASE } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/admissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();
        const data = await res.json();
        setAdmissions(data);
      } catch {
        setError("Failed to fetch");
      }
    };

    fetchAdmissions();
  }, [token]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {admissions.map((a) => (
        <div key={a._id}>{a.name}</div>
      ))}
    </div>
  );
}
