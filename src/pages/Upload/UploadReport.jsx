// ============================
// pages/Upload/UploadReport.jsx
// ============================
import { useState } from "react";

export default function UploadReport() {
  const [loading, setLoading] = useState(false);

  const submitReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("AI analysis completed successfully");
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Analyze Medical Report</h2>
      <input className="w-full mb-3 p-2 border rounded" placeholder="Report title" />
      <input className="w-full mb-4 cursor-pointer" type="file" accept="application/pdf"/>
      <button
        onClick={submitReport}
        className="w-full bg-teal-600 text-white py-2 rounded cursor-pointer transition-colors duration-600 ease-in-out
           hover:bg-teal-400 hover:scale-105"
      >
        {loading ? "Analyzing..." : "Get AI Analysis"}
      </button>
    </div>
  );
}