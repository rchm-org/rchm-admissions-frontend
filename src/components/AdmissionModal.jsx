import { API_BASE } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdmissionModal({
  admission,
  onClose,
  onStatusUpdate,
}) {
  const { token } = useAuth();

  if (!admission) return null;

  const updateStatus = async (status) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/admissions/${admission._id}`,
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
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Status updated");
      onStatusUpdate(data);
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isApproved = admission.status === "approved";
  const isArchived = admission.status === "archived";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Applicant Details
        </h2>

        {/* Details */}
        <div className="space-y-2 text-sm text-slate-700">
          <p><strong>Name:</strong> {admission.name}</p>
          <p><strong>Email:</strong> {admission.email}</p>
          <p><strong>Phone:</strong> {admission.phone}</p>
          <p><strong>Course:</strong> {admission.course}</p>

          {/* Reference ID */}
          {admission.referenceId && (
            <p className="font-mono text-xs text-slate-500">
              <strong>Reference ID:</strong> {admission.referenceId}
            </p>
          )}

          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize font-medium">
              {admission.status}
            </span>
          </p>
        </div>

        {/* Documents */}
        <div className="mt-6">
          <h3 className="font-medium text-slate-900 mb-2">
            Documents
          </h3>

          <ul className="space-y-1 text-sm">
            <li>
              <a
                href={`${API_BASE}/uploads/${admission.documents.marksheet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 hover:underline"
              >
                Marksheet
              </a>
            </li>
            <li>
              <a
                href={`${API_BASE}/uploads/${admission.documents.idProof}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 hover:underline"
              >
                ID Proof
              </a>
            </li>
            <li>
              <a
                href={`${API_BASE}/uploads/${admission.documents.photo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 hover:underline"
              >
                Photograph
              </a>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">

          {/* APPROVE */}
          <button
            disabled={isApproved || isArchived}
            onClick={() => updateStatus("approved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isApproved || isArchived
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }
            `}
          >
            Approve
          </button>

          {/* ARCHIVE */}
          <button
            disabled={isApproved || isArchived}
            onClick={() => updateStatus("archived")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isApproved || isArchived
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }
            `}
          >
            Archive
          </button>

          {/* UNARCHIVE */}
          <button
            disabled={!isArchived}
            onClick={() => updateStatus("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                !isArchived
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-100"
              }
            `}
          >
            Unarchive
          </button>

        </div>
      </div>
    </div>
  );
}
