import { useContext, useState } from "react";
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
      const response = await axios.post(https://reportease-backend.onrender.com/auth/login,
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
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Login to Reportease</h2>
        { error && <p className="text-red-600">{error}</p>}

        <input className="w-full mb-3 p-2 border rounded" placeholder="Email" required
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" required
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button
          disabled={loading}
          onClick={handleLogin}
          className="w-full bg-teal-600 text-white py-2 rounded cursor-pointer transition-colors duration-600 ease-in-out
           hover:bg-teal-400 hover:scale-105 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
