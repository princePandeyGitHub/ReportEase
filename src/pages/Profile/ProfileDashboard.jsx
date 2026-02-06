import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileDashboard() {
  const [reports, setReports] = useState([]);
  const [userName, setUserName] = useState('Not available');
  const [healthOverview,setHealthOverview] = useState('Not available');
  const [conditions, setConditions] = useState([]);

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

  const deleteReport = (id) => {
    setReports(reports.filter(r => r._id !== id));
    alert("Report deleted successfully");
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
              <button className="text-teal-800 cursor-pointer">Download</button>
              <button onClick={() => deleteReport(report._id)} className="text-red-500 cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}