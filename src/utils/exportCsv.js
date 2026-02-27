export const exportAdmissionsToCsv = (admissions) => {
    if (!admissions || !admissions.length) return;

    // Define headers and how to extract data for each column
    const headers = [
        { label: "Application ID", key: "applicationId" },
        { label: "Date Applied", key: "createdAt", format: (val) => new Date(val).toLocaleDateString("en-IN") },
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Course", key: "course" },
        { label: "Status", key: "status", format: (val) => val.toUpperCase() },
        { label: "Receipt PDF", key: "applicationPdf" },
        { label: "Marksheet", key: (a) => a.documents?.marksheet || "" },
        { label: "ID Document", key: (a) => a.documents?.idDocument || "" },
        { label: "Photograph", key: (a) => a.documents?.photograph || "" }
    ];

    // Helper to escape CSV values
    const escapeCsv = (str) => {
        if (str === null || str === undefined) return "";
        const stringified = String(str);
        if (stringified.includes(",") || stringified.includes('"') || stringified.includes("\n")) {
            return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
    };

    // Generate CSV Rows
    const csvRows = [];

    // 1. Add Header Row
    csvRows.push(headers.map(h => escapeCsv(h.label)).join(","));

    // 2. Add Data Rows
    for (const admission of admissions) {
        const row = headers.map(header => {
            let val;
            if (typeof header.key === 'function') {
                val = header.key(admission);
            } else {
                val = admission[header.key];
            }

            if (header.format && val) {
                val = header.format(val);
            }

            return escapeCsv(val);
        });
        csvRows.push(row.join(","));
    }

    // Combine rows with newlines
    const csvString = csvRows.join("\n");

    // Trigger Download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rchm_admissions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
