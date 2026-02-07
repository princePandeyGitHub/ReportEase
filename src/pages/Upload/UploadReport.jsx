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
  const [analysis, setAnalysis] = useState(null);

  const renderValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {value.map((item, index) => (
            <li key={index} className="text-sm text-slate-700">
              {renderValue(item)}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === "object") {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, item]) => (
            <div key={key} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {key.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </div>
              <div className="mt-1 text-sm text-slate-700">{renderValue(item)}</div>
            </div>
          ))}
        </div>
      );
    }
    return String(value);
  };

  const renderKeyFindings = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return <div className="text-sm text-slate-700">{renderValue(value)}</div>;
    }

    const rows = Object.entries(value).map(([label, details]) => {
      if (details && typeof details === "object" && !Array.isArray(details)) {
        return {
          label,
          actual: details["Actual Value"] ?? details.actual ?? details.value ?? "N/A",
          reference: details["Reference Value"] ?? details.reference ?? "N/A",
          unit: details.Unit ?? details.unit ?? "",
          extra: null,
        };
      }

      return {
        label,
        actual: "",
        reference: "",
        unit: "",
        extra: renderValue(details),
      };
    });

    const hasLabRows = rows.some((row) => row.actual || row.reference || row.unit);

    if (!hasLabRows) {
      return (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {row.label.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </div>
              <div className="mt-1">{row.extra}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Finding</th>
              <th className="px-3 py-2">Actual</th>
              <th className="px-3 py-2">Reference</th>
              <th className="px-3 py-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-800">
                  {row.label.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </td>
                <td className="px-3 py-2">{row.actual || "-"}</td>
                <td className="px-3 py-2">{row.reference || "-"}</td>
                <td className="px-3 py-2">{row.unit || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reports/analyze`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      setAnalysis(res.data);
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Analyze Medical Report</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload a PDF and receive an AI-generated summary and insights.
        </p>
        {success && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}
      </div>
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-100" />
            <div>
              <div className="font-medium text-slate-900">Analyzing report</div>
              <div className="text-sm text-slate-600">
                Extracting text and running AI analysis — this may take a few seconds.
              </div>
            </div>
          </div>
        </div>
      )}
      {analysis && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">AI Analysis</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Generated
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Summary
              </div>
              <div className="mt-2 text-sm text-slate-700">
                {renderValue(analysis.aiSummary)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Concerns
              </div>
              <div className="mt-2 text-sm text-slate-700">
                {renderValue(analysis.flags)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Key Findings
              </div>
              <div className="mt-2 text-sm text-slate-700">
                {renderKeyFindings(analysis.keyFindings)}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Full Analysis
            </div>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              {renderValue(analysis)}
            </div>
          </div>
        </div>
      )}
      <form onSubmit={submitReport} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor="report-title">
            Report title
          </label>
          <input
            id="report-title"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            placeholder="e.g. Annual blood work"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700" htmlFor="report-file">
            PDF file
          </label>
          <input
            id="report-file"
            className="w-full cursor-pointer rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg cursor-pointer bg-teal-600 py-2 text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Get AI Analysis"}
          </button>
        </div>
      </form>
    </div>
  );
}
