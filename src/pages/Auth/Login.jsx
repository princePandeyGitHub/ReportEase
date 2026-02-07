import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log(response.data)
      setIsAuthenticated(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
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
            Welcome back
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Login to ReportEase</h2>
          <p className="mt-2 text-sm text-slate-600">
            Access your reports and AI insights in one place.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-slate-700">Email</label>
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
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={handleLogin}
          className="mt-6 w-full cursor-pointer rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="mt-5 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-500">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
