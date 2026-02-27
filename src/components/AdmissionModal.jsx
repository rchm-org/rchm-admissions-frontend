import { useState } from "react";
import { API_BASE } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdmissionModal({ admission, onClose, onStatusUpdate }) {
  const { token } = useAuth();
  const [updating, setUpdating] = useState(false);

  if (!admission) return null;

  const updateStatus = async (status) => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/admissions/${admission._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Status update failed");

      toast.success("Status updated");
      onStatusUpdate(data);
      onClose();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const status = admission.status;
  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isArchived = status === "archived";
  const doc = admission.documents; // AWS S3 URL or null

  // Button enabled states
  const canApprove = isPending && !updating;
  const canArchive = (isPending || isApproved) && !updating;
  const canUnarchive = isArchived && !updating;

  const btnBase = "px-4 py-2 rounded-lg text-sm font-medium transition-all";
  const btnEnabled = (color) => `${btnBase} ${color}`;
  const btnDisabled = `${btnBase} bg-slate-100 text-slate-400 cursor-not-allowed`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-xl shadow-xl max-w-xl w-full mx-4 p-6 animate-slideUpFade">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg leading-none"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">Applicant Details</h2>
          <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize
            ${isPending ? "bg-amber-100 text-amber-700" : ""}
            ${isApproved ? "bg-emerald-100 text-emerald-700" : ""}
            ${isArchived ? "bg-slate-100 text-slate-600" : ""}
          `}>
            {status}
          </span>
        </div>

        {/* Details grid */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-6">
          {[
            ["Name", admission.name],
            ["Email", admission.email],
            ["Phone", admission.phone],
            ["Course", admission.course],
            ["Applied", new Date(admission.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit", month: "short", year: "numeric",
            })],
            admission.referenceId ? ["Reference", admission.referenceId] : null,
          ].filter(Boolean).map(([label, value]) => (
            <div key={label}>
              <dt className="text-slate-500 font-medium">{label}</dt>
              <dd className="text-slate-900 mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Document */}
        <div className="border-t border-slate-100 pt-4 mb-6">
          <p className="text-sm font-medium text-slate-700 mb-2">Supporting Document</p>
          {doc ? (
            <a
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              📄 View uploaded document ↗
            </a>
          ) : (
            <p className="text-sm text-slate-400">No document uploaded.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            disabled={!canApprove}
            onClick={() => updateStatus("approved")}
            className={canApprove
              ? btnEnabled("bg-emerald-600 text-white hover:bg-emerald-500")
              : btnDisabled}
          >
            Approve
          </button>

          <button
            disabled={!canArchive}
            onClick={() => updateStatus("archived")}
            className={canArchive
              ? btnEnabled("bg-slate-900 text-white hover:bg-slate-700")
              : btnDisabled}
          >
            Archive
          </button>

          <button
            disabled={!canUnarchive}
            onClick={() => updateStatus("pending")}
            className={canUnarchive
              ? btnEnabled("border border-slate-300 text-slate-700 hover:bg-slate-50")
              : btnDisabled}
          >
            Unarchive
          </button>
        </div>
      </div>
    </div>
  );
}
