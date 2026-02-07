import { AuthContext } from "../../App";
import axios from "axios";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState('')

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {

      // registration 
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );

      // login after registration
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Get started
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Save your reports securely and unlock AI insights.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-slate-700">Full name</label>
        <input
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          placeholder="Your name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">Email</label>
        <input
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
        <input
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          type="password"
          placeholder="Create a password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="mt-6 w-full cursor-pointer rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={handleRegister}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
