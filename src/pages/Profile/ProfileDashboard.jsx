import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function ProfileDashboard() {
  const [reports, setReports] = useState([]);
  const [userName, setUserName] = useState('Not available');
  const [healthOverview,setHealthOverview] = useState('Not available');
  const [conditions, setConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);
  const [activeReportId, setActiveReportId] = useState(null);

  useEffect(()=>{
    const loadReports = async() => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports`,{
        withCredentials: true,
      })
      setReports(response.data.reports);
    }

    const loadProfile = async() => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`,{
        withCredentials: true,
      })
      setUserName(response.data.user.name);
      setHealthOverview(response.data.user.healthProfile.overview);
      setConditions(response.data.user.healthProfile.conditions);
    }

    loadReports();
    loadProfile();
  },[])

  const downloadReport = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/reports/download/${id}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const contentDisposition = res.headers["content-disposition"] || "";
      const match = contentDisposition.match(/filename="?([^"]+)"?/i);
      const filename = match?.[1] || `report-${id}.pdf`;

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
      alert(error || "something went wrong");
    } finally {
      setIsLoading(false)
    }
  };

  const deleteReport = async (id) => {
    try {
      const confirmation = confirm("do you really want to delete report?");
      if(confirmation){
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/reports/delete/${id}`,{withCredentials: true})
        console.log(res.data);
        alert("report deleted successfully");
      }
    } catch (error) {
      console.log(error);
      alert(error || "something went wrong");
    }
    setReports(reports.filter(r => r._id !== id));
  };

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
            <div key={key} className="rounded-md border border-slate-200 bg-white p-3">
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

  const chartSeries = useMemo(() => {
    const numericFromValue = (value) => {
      if (value === null || value === undefined) return null;
      if (typeof value === "number") return value;
      const match = String(value).match(/-?\d+(\.\d+)?/);
      return match ? Number(match[0]) : null;
    };

    const seriesMap = new Map();
    const ordered = [...reports].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    ordered.forEach((report) => {
      const keyFindings = report.keyFindings;
      if (!keyFindings || typeof keyFindings !== "object") return;

      Object.entries(keyFindings).forEach(([metric, details]) => {
        if (!details || typeof details !== "object" || Array.isArray(details)) return;
        const value =
          details["Actual Value"] ??
          details.actual ??
          details.value ??
          details.result ??
          details.Result;
        const numeric = numericFromValue(value);
        if (numeric === null || Number.isNaN(numeric)) return;

        if (!seriesMap.has(metric)) {
          seriesMap.set(metric, {
            metric,
            unit: details.Unit ?? details.unit ?? "",
            points: [],
          });
        }
        seriesMap.get(metric).points.push({
          value: numeric,
          date: report.createdAt,
          reportId: report._id,
        });
      });
    });

    const allSeries = Array.from(seriesMap.values()).filter((series) => series.points.length > 1);
    allSeries.sort((a, b) => b.points.length - a.points.length);
    return allSeries.slice(0, 3);
  }, [reports]);

  const renderSparkline = (points) => {
    if (!points.length) return null;
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const width = 120;
    const height = 36;

    const coords = points.map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${x},${y}`;
    });

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-full">
        <polyline
          fill="none"
          stroke="#0f766e"
          strokeWidth="2"
          points={coords.join(" ")}
        />
        {coords.map((coord, index) => (
          <circle
            key={coord}
            cx={coord.split(",")[0]}
            cy={coord.split(",")[1]}
            r="2"
            fill="#0f766e"
            opacity={index === coords.length - 1 ? 1 : 0.6}
          />
        ))}
      </svg>
    );
  };

  const visibleReports = showAllReports ? reports : reports.slice(0, 3);
  const hasMoreReports = reports.length > 3;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">{userName}</div>
          <div className="mt-1 text-sm text-slate-500">Patient overview</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Reports</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{reports.length}</div>
          <div className="mt-1 text-sm text-slate-500">Uploaded in your archive</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conditions</div>
          <div className="mt-2 text-sm text-slate-700">
            {conditions.length ? (
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition) => (
                  <span
                    key={condition}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              "Not available"
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Health Overview
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Personal summary</h2>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {healthOverview || "Not available"}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reports</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Latest analyses</h2>
          </div>
          {hasMoreReports && (
            <button
              type="button"
              onClick={() => setShowAllReports((prev) => !prev)}
              className="rounded-full border cursor-pointer border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
            >
              {showAllReports ? "View less" : "View more"}
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {chartSeries.map((series) => (
            <div key={series.metric} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {series.metric.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {series.points[series.points.length - 1].value}
                {series.unit ? ` ${series.unit}` : ""}
              </div>
              <div className="mt-2">{renderSparkline(series.points)}</div>
              <div className="mt-2 text-xs text-slate-500">
                {series.points.length} reports tracked
              </div>
            </div>
          ))}
          {!chartSeries.length && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Upload multiple reports with numeric metrics to see trend charts.
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {visibleReports.map((report) => (
            <div key={report._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">{report.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{report.aiSummary}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm font-medium">
                  <button
                    className="text-teal-600 cursor-pointer"
                    onClick={() =>
                      setActiveReportId((prev) => (prev === report._id ? null : report._id))
                    }
                  >
                    {activeReportId === report._id ? "Hide" : "View"}
                  </button>
                  <button
                    onClick={() => downloadReport(report._id)}
                    className="text-teal-800 cursor-pointer"
                    disabled={isLoading}
                  >
                    Download
                  </button>
                  <button onClick={() => deleteReport(report._id)} className="text-rose-600 cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
              {activeReportId === report._id && (
                <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      AI Summary
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{report.aiSummary}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Flags
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{renderValue(report.flags)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Key Findings
                    </div>
                    <div className="mt-2">{renderKeyFindings(report.keyFindings)}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!reports.length && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No reports uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
