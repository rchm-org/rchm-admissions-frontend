const tabs = [
  { key: "pending", label: "Inbox" },
  { key: "approved", label: "Approved" },
  { key: "archived", label: "Archived" },
];

export default function AdminTabs({ active, onChange }) {
  return (
    <div className="flex gap-4 mb-6">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium
            ${
              active === t.key
                ? "bg-slate-900 text-white"
                : "bg-white border"
            }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}