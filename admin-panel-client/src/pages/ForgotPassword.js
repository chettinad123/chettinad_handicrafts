import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with your actual send-OTP API endpoint
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Unable to send OTP. Please check your email.");

      toast.success("OTP sent to your email!");
      navigate("/reset-password", { state: { email } });
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
            Forgot Password?
          </h1>
          <p className="mt-2 text-sm text-[#2A190C]/70">
            Enter your registered email and we'll send you an OTP to reset your password.
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
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#E29C15]/70 bg-transparent pl-11 pr-4 py-3 text-sm text-[#0B1A35] placeholder:text-[#0B1A35]/40 focus:outline-none focus:ring-2 focus:ring-[#E29C15]/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E29C15] hover:bg-[#C98B24] disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-6 py-3.5 text-sm font-semibold text-white"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
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