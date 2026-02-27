import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm p-10 text-center">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="RCHM Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
            Royal College of Hospitality & Management
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mb-10">
            The official admissions portal for Royal College of Hospitality & Management.
            Apply online and track your application status digitally.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admission"
              className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
            >
              Apply for Admission
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
            >
              Admin Login
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
