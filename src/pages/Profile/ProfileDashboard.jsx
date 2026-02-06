import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileDashboard() {
  const [reports, setReports] = useState([]);
  const [userName, setUserName] = useState('Not available');
  const [healthOverview,setHealthOverview] = useState('Not available');
  const [conditions, setConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">Name: {userName}</div>
        <div className="card">Total Reports: {reports.length}</div>
        <div className="card">Conditions: {conditions.join(" ")}</div>
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <div key={report._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{report.title}</h3>
            <p className="text-sm opacity-80">{report.aiSummary}</p>
            <div className="mt-3 flex gap-3">
              <button className="text-teal-600 cursor-pointer">View</button>
              <button onClick={() => downloadReport(report._id)} className="text-teal-800 cursor-pointer" disabled={isLoading}>Download</button>
              <button onClick={() => deleteReport(report._id)} className="text-red-500 cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
