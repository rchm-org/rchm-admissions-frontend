import { useAuth } from "../context/AuthContext";

export default function AdminHeader({
  search,
  setSearch,
  date,
  setDate,
}) {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) logout();
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
      <input
        placeholder="Search name, email, phone, course…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />

      <button
        onClick={handleLogout}
        className="text-sm px-4 py-2 rounded-lg bg-slate-900 text-white"
      >
        Logout
      </button>
    </header>
  );
}