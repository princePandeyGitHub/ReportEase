// ============================
// pages/Upload/UploadReport.jsx
// ============================
import { useState } from "react";
import axios from "axios";

export default function UploadReport() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitReport = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a report title.");
      return;
    }

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reports/analyze`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess("AI analysis completed successfully.");
      setTitle("");
      setFile(null);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to analyze report. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Analyze Medical Report</h2>
      <form onSubmit={submitReport} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Report title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          className="w-full cursor-pointer"
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-teal-700">{success}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 rounded cursor-pointer transition-colors duration-600 ease-in-out
           hover:bg-teal-400 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Get AI Analysis"}
        </button>
      </form>
    </div>
  );
}
