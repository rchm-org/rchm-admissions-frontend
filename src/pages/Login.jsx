import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import logo from "../assets/logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/admin/auth/login", { email, password });
      login(res.data.token);
      navigate("/admin/admissions", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid credentials. Please make sure you are using admin@rchm.org.in");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col items-center justify-center px-12 relative overflow-hidden">
        {/* decorative rings */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/5" />

        <div className="relative z-10 text-center">
          <img src={logo} alt="RCHM Logo" className="h-20 w-auto mx-auto mb-8 drop-shadow-xl" />
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Royal College of Hospitality & Management
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            Admin portal for managing student admissions, reviewing applications, and tracking enrolment.
          </p>
        </div>

        {/* bottom badge */}
        <p className="absolute bottom-6 text-xs text-slate-600 tracking-widest uppercase">
          Royal College of Hospitality & Management
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logo} alt="RCHM" className="h-14 w-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              Sign in
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Administrator access only
            </p>

            {error && (
              <div className="mb-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@rchm.org.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} Royal College of Hospitality & Management. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;