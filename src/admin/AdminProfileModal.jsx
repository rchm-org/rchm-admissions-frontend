import { useAuth } from "../context/AuthContext";

export default function AdminProfileModal({ onClose }) {
    const { token } = useAuth();

    // Decode JWT payload to extract user info (like email/role)
    let adminEmail = "Admin User";
    let adminRole = "Administrator";

    if (token) {
        try {
            const payloadBase64 = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            if (decodedPayload.email) adminEmail = decodedPayload.email;
            if (decodedPayload.role) adminRole = decodedPayload.role.charAt(0).toUpperCase() + decodedPayload.role.slice(1);
        } catch (e) {
            // Ignore decoding errors
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-cardRise">
                {/* Profile Header */}
                <div className="bg-slate-900 pt-8 pb-6 px-6 relative text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-3xl text-white font-bold mx-auto border-4 border-slate-800 shadow-md">
                        {adminEmail.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">{adminEmail}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-6">
                        {adminRole}
                    </span>

                    <div className="space-y-3 text-sm text-left">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Status</span>
                            <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Active Session
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Access Level</span>
                            <span className="font-medium text-slate-900">Full Access</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-slate-500">System</span>
                            <span className="font-medium text-slate-900">RCHM Admissions Platform</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
