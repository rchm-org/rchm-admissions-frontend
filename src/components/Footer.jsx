export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} RCHM. All rights reserved.
      </div>
    </footer>
  );
}
