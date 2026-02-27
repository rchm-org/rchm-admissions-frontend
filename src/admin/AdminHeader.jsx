import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ search, setSearch, date, setDate }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
      <input
        placeholder="Search name, email, phone, course…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
      />

      <button
        onClick={handleLogout}
        className="text-sm px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors whitespace-nowrap"
      >
        Logout
      </button>
    </header>
  );
}