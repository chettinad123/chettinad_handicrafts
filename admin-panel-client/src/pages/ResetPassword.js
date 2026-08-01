import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed along from the Forgot Password page
  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with your actual reset-password API endpoint
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid OTP or unable to reset password.");

      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-[#F7F2E8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E29C15] bg-white px-8 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="mt-6 font-serif text-2xl sm:text-3xl text-[#5B2D07]">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-[#2A190C]/70">
            Enter the OTP sent to your email and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E29C15]" />
              <input
                type="email"
                name="email"
                required
                readOnly={Boolean(emailFromState)}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border border-[#E29C15]/70 pl-11 pr-4 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 ${
                  emailFromState ? "bg-[#F7F2E8] cursor-not-allowed" : "bg-transparent"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
              OTP
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E29C15]" />
              <input
                type="text"
                name="otp"
                required
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter the 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-11 pr-4 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50 tracking-widest"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5B2D07] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E29C15]" />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                required
                minLength={8}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
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
            {loading ? "Updating..." : "Update Password"}
          </button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-[#5B2D07] hover:text-[#E29C15] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </form>
      </div>
    </section>
  );
}