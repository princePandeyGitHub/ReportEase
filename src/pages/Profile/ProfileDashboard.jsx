import { useState } from "react";

const mockReports = [
  { id: 1, title: "Blood Test", date: "Jan 2026", summary: "Most values normal" },
  { id: 2, title: "Liver Function", date: "Feb 2026", summary: "Slight ALT elevation" },
];

export default function ProfileDashboard() {
  const [reports, setReports] = useState(mockReports);

  const deleteReport = (id) => {
    setReports(reports.filter(r => r.id !== id));
    alert("Report deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">User: John Doe</div>
        <div className="card">Total Reports: {reports.length}</div>
        <div className="card">Health Status: Stable</div>
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{report.title}</h3>
            <p className="text-sm opacity-80">{report.summary}</p>
            <div className="mt-3 flex gap-3">
              <button className="text-teal-600 cursor-pointer">View</button>
              <button onClick={() => deleteReport(report.id)} className="text-red-500 cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}