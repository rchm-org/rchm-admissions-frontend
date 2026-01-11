export default function AdmissionModal({
  admission,
  onClose,
  onStatusUpdate,
}) {
  if (!admission) return null;

  const handleArchive = async () => {
    const confirmArchive = window.confirm(
      "Are you sure you want to archive this admission?"
    );
    if (!confirmArchive) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/admissions/${admission._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "closed" }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 🔁 update parent list instantly
      onStatusUpdate(data.admission);
      onClose();
    } catch (err) {
      alert(err.message || "Failed to archive admission");
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <h2>Admission Details</h2>

        <p><strong>Name:</strong> {admission.name}</p>
        <p><strong>Email:</strong> {admission.email}</p>
        <p><strong>Phone:</strong> {admission.phone}</p>
        <p><strong>Course:</strong> {admission.course}</p>
        <p><strong>Status:</strong> {admission.status}</p>
        <p>
          <strong>Applied On:</strong>{" "}
          {new Date(admission.createdAt).toLocaleString()}
        </p>

        <hr />

        <h3>Documents</h3>
        <ul>
          <li>
            <a
              href={`http://localhost:5000/uploads/${admission.documents.marksheet}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 Marksheet
            </a>
          </li>
          <li>
            <a
              href={`http://localhost:5000/uploads/${admission.documents.idProof}`}
              target="_blank"
              rel="noreferrer"
            >
              🪪 ID Proof
            </a>
          </li>
          <li>
            <a
              href={`http://localhost:5000/uploads/${admission.documents.photo}`}
              target="_blank"
              rel="noreferrer"
            >
              🖼 Photo
            </a>
          </li>
        </ul>

        <hr />

        {/* 🚫 Hide archive button if already archived */}
        {admission.status !== "closed" && (
          <button
            onClick={handleArchive}
            style={{
              background: "#c0392b",
              color: "#fff",
              padding: "10px",
              width: "100%",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Archive Admission
          </button>
        )}
      </div>
    </div>
  );
}

/* styles */
const backdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "2rem",
  width: "450px",
  borderRadius: "8px",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
};
