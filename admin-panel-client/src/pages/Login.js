import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../assets/Logo.svg";
import api from "../common/apiClient"; // adjust path to wherever apiClient.js lives
import SummaryApi from "../common/SummaryApi"; // adjust path to wherever summaryApi.js lives

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend reads `username || email` — send the same typed value
      // under both keys so it works whether the user enters their
      // username or their email address.
      const response = await api({
        url: SummaryApi.createLogin.url,
        method: SummaryApi.createLogin.method,
        data: {
          username: formData.identifier,
          email: formData.identifier,
          password: formData.password,
        },
      });

      console.log("Login response:", response.data);

      const payload = response.data?.data ?? response.data;
      const token = payload?.token ?? payload?.accessToken;
      const user = payload?.user;

      if (!token) {
        throw new Error("Login succeeded but no token was returned by the server.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user ?? null));

      toast.success("Logged in successfully!");
      navigate("/admin-panel");
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F2E8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E29C15] bg-white px-8 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="Chettinad Handi Crafts" className="h-16 w-auto" />
          <h1 className="mt-6 font-serif text-2xl sm:text-3xl text-[#5B2D07]">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-[#2A190C]/70">
            Sign in to manage your website content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E29C15]" />
              <input
                type="text"
                name="identifier"
                required
                placeholder="Enter your email or username"
                value={formData.identifier}
                onChange={handleChange}
                autoComplete="username"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-11 pr-4 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[#5B2D07]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#E29C15] hover:text-[#C98B24] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E29C15]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-11 pr-11 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B1A35]/40 hover:text-[#0B1A35] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E29C15] hover:bg-[#C98B24] disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-6 py-3.5 text-sm font-semibold text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}