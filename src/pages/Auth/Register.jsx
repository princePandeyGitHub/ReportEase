export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
        <input className="w-full mb-3 p-2 border rounded" placeholder="Name" />
        <input className="w-full mb-3 p-2 border rounded" placeholder="Email" />
        <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" />
        <button className="w-full bg-teal-600 text-white py-2 rounded cursor-pointer transition-colors duration-600 ease-in-out
           hover:bg-teal-400 hover:scale-105">
          Register
        </button>
      </div>
    </div>
  );
}