import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("sales");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
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
      onSubmit={handleRegister}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />
      </div>

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

      <button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 transition text-white py-3 rounded-xl font-semibold"
      >
        Register
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

export default RegisterPage;