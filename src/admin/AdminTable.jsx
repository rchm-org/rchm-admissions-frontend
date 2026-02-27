export default function AdminTable({ data, onRowClick, loading }) {
  if (loading) {
    return <p className="text-slate-500">Loading…</p>;
  }

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-xl text-center text-slate-500">
        No applications found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Course</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr
              key={a._id}
              onClick={() => onRowClick(a)}
              className="border-t hover:bg-slate-50 cursor-pointer"
            >
              <td className="p-3 font-medium">{a.name}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3">{a.phone}</td>
              <td className="p-3">{a.course}</td>
              <td className="p-3">
                {new Date(a.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}