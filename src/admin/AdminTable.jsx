export default function AdminTable({ data, onRowClick, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-slate-400 text-sm animate-pulse">
        Loading applications…
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white p-10 rounded-xl text-center text-slate-400">
        <p className="text-3xl mb-2">📭</p>
        <p className="text-sm">No applications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 font-medium text-slate-600">App ID</th>
            <th className="px-4 py-3 font-medium text-slate-600">Name</th>
            <th className="px-4 py-3 font-medium text-slate-600">Email</th>
            <th className="px-4 py-3 font-medium text-slate-600">Phone</th>
            <th className="px-4 py-3 font-medium text-slate-600">Course</th>
            <th className="px-4 py-3 font-medium text-slate-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr
              key={a._id}
              onClick={() => onRowClick(a)}
              className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 font-medium text-emerald-600">{a.applicationId || "Legacy"}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{a.name}</td>
              <td className="px-4 py-3 text-slate-600">{a.email}</td>
              <td className="px-4 py-3 text-slate-600">{a.phone}</td>
              <td className="px-4 py-3 text-slate-600">{a.course}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(a.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}