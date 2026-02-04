// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfileDashboard from "./pages/Profile/ProfileDashboard";
import UploadReport from "./pages/Upload/UploadReport";
import AIDoctorChat from "./pages/AIDoctor/AIDoctorChat";
import Documentation from "./pages/Documentation/Documentation";

export const AuthContext = createContext();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
          <Navbar />
          <main className="grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={isAuthenticated ? <ProfileDashboard /> : <Navigate to="/" />} />
              <Route path="/upload" element={isAuthenticated ? <UploadReport /> : <Navigate to="/" />} />
              <Route path="/ai-doctor" element={isAuthenticated ? <AIDoctorChat /> : <Navigate to="/" />} />
              <Route path="/docs" element={<Documentation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}