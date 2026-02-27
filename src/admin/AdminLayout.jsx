import AdminHeader from "./AdminHeader";

export default function AdminLayout({
  children,
  search,
  setSearch,
  date,
  setDate,
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader
        search={search}
        setSearch={setSearch}
        date={date}
        setDate={setDate}
      />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}