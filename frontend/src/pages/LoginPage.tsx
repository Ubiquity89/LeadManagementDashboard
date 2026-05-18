import { useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
  <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900">
        Smart Leads
      </h1>

      <p className="text-gray-500 mt-2">
        Manage and track your leads easily
      </p>
    </div>

    <form
      onSubmit={handleLogin}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />
      </div>
      {error && (
  <p className="text-red-500 text-sm">
    {error}
  </p>
)}

      <button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 transition text-white py-3 rounded-xl font-semibold"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p className="text-center text-gray-500 mt-6">
      Don’t have an account?
      <span
        onClick={() =>
          navigate("/register")
        }
        className="text-black font-semibold cursor-pointer ml-1"
      >
        Register
      </span>
    </p>
  </div>
</div>
  );
}

export default LoginPage;