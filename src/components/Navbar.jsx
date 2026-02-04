import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../App";

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation() // get current route

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-teal-600">Reportease</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/docs" className={`hover:underline underline-offset-4 decoration-2 ${isActive("/docs") ? "underline" : ""
            }`}>Documentation</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className={`hover:underline underline-offset-4 decoration-2 ${isActive("/profile") ? "underline" : ""
                }`}>Profile</Link>
              <Link to="/upload" className={`hover:underline underline-offset-4 decoration-2 ${isActive("/upload") ? "underline" : ""
                }`}>Analyze Report</Link>
              <Link to="/ai-doctor" className={`hover:underline underline-offset-4 decoration-2 ${isActive("/ai-doctor") ? "underline" : ""
                }`}>AI Doctor</Link>
              <button onClick={() => setIsAuthenticated(false)} className="text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className={`hover:underline underline-offset-4 decoration-2 ${isActive("/login") ? "underline" : ""
                }`}>Login</Link>
              <Link to="/register" className={`hover:underline underline-offset-4 decoration-2 ${isActive("/register") ? "underline" : ""
                }`}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white">
          <Link to="/docs" onClick={() => setMenuOpen(false)}>Documentation</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link to="/upload" onClick={() => setMenuOpen(false)}>Analyze Report</Link>
              <Link to="/ai-doctor" onClick={() => setMenuOpen(false)}>AI Doctor</Link>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setMenuOpen(false);
                }}
                className="text-left text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}