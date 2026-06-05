const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col p-5">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-800">
          AI Recruiter
        </h1>
        <p className="text-sm text-gray-500">Resume Screening System</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-3 text-gray-600 font-medium">
        <a className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          📊 Dashboard
        </a>

        <a className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          👨‍💼 Candidates
        </a>

        <a className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          📈 Analytics
        </a>

        <a className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          🔔 Activity
        </a>

        <a className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          ⚙️ Settings
        </a>
      </nav>

      {/* Bottom */}
      <div className="mt-auto text-xs text-gray-400">
        v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;