// ============================
import { useContext, useState } from "react";
import { AuthContext } from "../../App";

export default function Login() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Login to Reportease</h2>
        <input className="w-full mb-3 p-2 border rounded" placeholder="Email" />
        <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" />
        <button
          onClick={handleLogin}
          className="w-full bg-teal-600 text-white py-2 rounded cursor-pointer transition-colors duration-600 ease-in-out
           hover:bg-teal-400 hover:scale-105"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}