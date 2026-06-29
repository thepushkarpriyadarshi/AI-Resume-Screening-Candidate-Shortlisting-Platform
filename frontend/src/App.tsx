import * as XLSX from "xlsx";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Bell,
  Briefcase,
  LayoutDashboard,
  Settings,
  Upload,
  Users,
  LogOut,
  FileText,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
type CandidateType = {
  _id?: string;
  id?: number;
  name: string;
  email?: string;
  role?: string;
  skills: string[] | string;
  score: string | number;
  scoreDisplay?: string;
  status: string;
  fileName?: string;
  filePath?: string;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Protected><Layout><Dashboard /></Layout></Protected>} />
        <Route path="/candidates" element={<Protected><Layout><Candidates /></Layout></Protected>} />
        <Route path="/upload" element={<Protected><Layout><UploadResume /></Layout></Protected>} />
        <Route path="/jobs" element={<Protected><Layout><Jobs /></Layout></Protected>} />
        <Route path="/settings" element={<Protected><Layout><SettingsPage /></Layout></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}

function Protected({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f5f7ff]">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0f172a] to-[#7c3aed] text-white items-center justify-center p-16">
        <div>
          <h1 className="text-6xl font-bold">HireSmart AI</h1>
          <p className="text-xl mt-5 text-gray-200">
            AI Resume Screening & Candidate Shortlisting Platform
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-4xl font-bold mb-2">Login</h2>
          <p className="text-gray-500 mb-8">Welcome back recruiter</p>

          <input
            className="w-full border p-4 rounded-xl mb-4"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-4 rounded-xl mb-6"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-animated w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">
            Login
          </button>

          <p className="text-center mt-6">
            Don’t have account?{" "}
            <Link to="/register" className="text-indigo-600 font-bold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        alert("Registration successful. Please login.");
        navigate("/login");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f5f7ff]">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0f172a] to-[#7c3aed] text-white items-center justify-center p-16">
        <div>
          <h1 className="text-6xl font-bold">Create Account</h1>
          <p className="text-xl mt-5 text-gray-200">
            Start hiring smarter with AI
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleRegister}
          className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-4xl font-bold mb-2">Register</h2>
          <p className="text-gray-500 mb-8">Create recruiter account</p>

          <input
            className="w-full border p-4 rounded-xl mb-4"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border p-4 rounded-xl mb-4"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-4 rounded-xl mb-6"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-animated w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">
            Create Account
          </button>

          <p className="text-center mt-6">
            Already have account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle =
    location.pathname === "/jobs"
      ? "Job Management"
      : location.pathname === "/candidates"
      ? "Candidates"
      : location.pathname === "/upload"
      ? "Resume Upload"
      : location.pathname === "/settings"
      ? "Settings"
      : "Recruitment Dashboard";

  const pageSubtitle =
    location.pathname === "/jobs"
      ? "Create and manage job openings"
      : location.pathname === "/candidates"
      ? "Manage candidate profiles"
      : location.pathname === "/upload"
      ? "Upload and analyze resumes"
      : location.pathname === "/settings"
      ? "Manage application settings"
      : "AI powered hiring overview";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen lg:h-auto
          w-[260px]
          bg-[#071028] text-white p-5 md:p-6
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold">HireSmart AI</h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white text-2xl"
          >
            ×
          </button>
        </div>

        <SideLink to="/dashboard" icon={<LayoutDashboard />} text="Dashboard" />
        <SideLink to="/jobs" icon={<Briefcase />} text="Jobs" />
        <SideLink to="/candidates" icon={<Users />} text="Candidates" />
        <SideLink to="/upload" icon={<Upload />} text="Resume Upload" />
        <SideLink to="/settings" icon={<Settings />} text="Settings" />

        <div
          onClick={() => setShowProfile(!showProfile)}
          className="mt-6 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 shadow-lg cursor-pointer hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
              {user?.name
                ?.split(" ")
                .map((word: string) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-indigo-100">Logged in as</p>
              <h3 className="text-sm font-bold text-white truncate">
                {user?.name || "Recruiter"}
              </h3>
            </div>
          </div>
        </div>

        {showProfile && (
          <div className="mb-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">User Profile</h3>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-gray-600">Full Name:</span>
                <p className="text-gray-800 break-words">
                  {user?.name || "Not Available"}
                </p>
              </div>

              <div>
                <span className="font-semibold text-gray-600">Email:</span>
                <p className="text-gray-800 break-all">
                  {user?.email || "Not Available"}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="btn-animated mt-auto bg-red-500 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:ml-0">
        <nav className="bg-white px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center shadow-sm">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-[#071028] text-white px-3 py-2 rounded-xl"
            >
              ☰
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold break-words">
                {pageTitle}
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                {pageSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/jobs")}
            className="btn-animated bg-indigo-600 text-white px-5 py-3 rounded-xl w-full sm:w-auto"
          >
            Click for Create Jobs
          </button>
        </nav>

        <div className="w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

function SideLink({ to, icon, text }: { to: string; icon: ReactNode; text: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `btn-animated flex items-center gap-3 p-4 mb-3 rounded-xl ${isActive ? "bg-indigo-600" : "hover:bg-white/10"}`
      }
    >
      {icon}
      {text}
    </NavLink>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    shortlisted: 0,
    rejected: 0,
    averageScore: "0%",
  });

  const [loading, setLoading] = useState(true);

  const [activities, setActivities] = useState([]);

  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
  fetchStats();
  fetchActivities();
}, []);

  const chartData = [
  {
    name: "Shortlisted",
    value: stats.shortlisted,
  },
  {
    name: "Rejected",
    value: stats.rejected,
  },
];

const COLORS = [
  "#22c55e",
  "#ef4444",
];

  const fetchStats = async () => {
    try {
     const token = localStorage.getItem("token");

const response = await axios.get(
  "http://localhost:5000/api/stats",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.log("Stats fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/activity-logs",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setActivities(response.data.logs);
    }
  } catch (error) {
    console.log("Activity fetch failed", error);
  }
};

  return (
    <>
      <section className="m-6 bg-gradient-to-r from-[#0f172a] via-[#312e81] to-[#7c3aed] rounded-[35px] p-10 text-white shadow-2xl">
        <h1 className="text-5xl font-bold leading-tight">
          AI Resume Screening &{" "}
          <span className="text-purple-300">
            Candidate Shortlisting
          </span>
        </h1>

        <p className="mt-5 text-gray-200 text-lg">
          Screen resumes, analyze candidates, and hire faster with AI scoring.
        </p>
      </section>

      {loading ? (
        <div className="px-6">
          <div className="card-animated bg-white p-8 rounded-3xl shadow-sm">
            Loading Dashboard...
          </div>
        </div>
      ) : (
        <>
         <section className="px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card title="Total Candidates" value={String(stats.totalCandidates)} />
            <Card title="Shortlisted" value={String(stats.shortlisted)} />
            <Card title="Rejected" value={String(stats.rejected)} />
            <Card title="Average Score" value={stats.averageScore} />
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-4 md:px-6 mt-6">
            <div className="card-animated bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">
                Candidate Status Distribution
              </h2>

              <div className="px-6 mt-6">
  <div className="card-animated bg-white rounded-3xl p-6 shadow-sm">
    <h2 className="text-2xl font-bold mb-4">
      Recent Activity Logs
    </h2>

    {activities.length === 0 ? (
      <p className="text-gray-500">
        No activity found.
      </p>
    ) : (
      <div className="space-y-3">
        {activities.slice(0, showAllActivities ? activities.length : 3).map((log, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 bg-gray-50"
          >
            <p className="font-bold text-indigo-600">
              {log.action}
            </p>

            <p className="text-gray-700">
              {log.details}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
       {activities.length > 3 && (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => setShowAllActivities(!showAllActivities)}
      className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
    >
      {showAllActivities ? "▲ Show Less" : "▼ See More"}
    </button>
  </div>
)}
      </div>
    )}
  </div>
</div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                   data={chartData}
                   dataKey="value"
                    nameKey="name"
                   outerRadius={110}
                   innerRadius={50}
                   paddingAngle={4}
                 label
     >
  {chartData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card-animated bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">
                Recruitment Analytics
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                 dataKey="value"
                 radius={[12, 12, 0, 0]}
                  fill="#6366f1"
                 />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  const [analysis, setAnalysis] = useState<{
    name: string;
    email: string;
    phone: string;
    skills: string[];
    score: string | number;
    scoreDisplay?: string;
    recommendation: string;
  } | null>(null);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.log("Jobs fetch failed", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpload = async () => {
    if (!selectedJobId) {
      alert("Select a job first");
      return;
    }

    if (!file) {
      alert("Pehle single PDF resume select karo");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", selectedJobId);

    try {
      setMessage("Uploading...");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setAnalysis(response.data.analysis);
    } catch (error) {
      setMessage("Upload Failed");
      setAnalysis(null);
    }
  };

  const handleBulkUpload = async () => {
  if (!selectedJobId) {
    alert("Select a job first");
    return;
  }

  if (bulkFiles.length === 0) {
    alert("Pehle bulk PDFs select karo");
    return;
  }

  if (bulkFiles.length > 50) {
    alert("Maximum 50 resumes ek saath upload kar sakte ho");
    return;
  }

  const formData = new FormData();

  formData.append("jobId", selectedJobId);

  bulkFiles.forEach((file) => {
    formData.append("resumes", file);
  });

  try {
    setBulkMessage("Bulk uploading resumes...");

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/upload/bulk",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const results = response.data.results || [];

    const successCount = results.filter(
      (item: any) => item.success
    ).length;

    const failedCount = results.filter(
      (item: any) => !item.success
    ).length;

    setBulkMessage(
      `Bulk upload complete: ${successCount} successful, ${failedCount} failed`
    );
  } catch (error) {
    console.log(error);
    setBulkMessage("Bulk Upload Failed");
  }
};


  return (
    <div className="p-4 md:p-6">
      <div className="card-animated bg-white rounded-3xl p-5 md:p-10 shadow-sm">
        <h2 className="text-3xl font-bold mb-3">Upload Resume</h2>
        <p className="text-gray-500 mb-8">
          Select a job role first, then upload resume for AI screening.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-3xl p-10 text-center">
            <FileText className="mx-auto text-indigo-600 mb-4" size={55} />

            <h3 className="text-2xl font-bold mb-2">Single Resume Upload</h3>
            <p className="text-gray-500 mb-6">
              Upload one PDF resume for selected job
            </p>

            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full mb-5 border border-indigo-300 rounded-xl p-3"
            >
              <option value="">Select Job Role</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>

            <label className="btn-animated inline-block bg-white border border-indigo-300 text-indigo-700 px-8 py-4 rounded-xl font-bold cursor-pointer">
              Choose Resume File
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setMessage("");
                  setAnalysis(null);
                }}
              />
            </label>

            {file && (
              <p className="mt-5 font-semibold text-indigo-600">
                Selected File: {file.name}
              </p>
            )}

            <button
              onClick={handleUpload}
              className="btn-animated mt-8 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold"
            >
              Upload & Analyze
            </button>

            {message && (
              <p className="mt-5 font-semibold text-green-600">{message}</p>
            )}
          </div>

          <div className="border-2 border-dashed border-purple-300 bg-purple-50 rounded-3xl p-10 text-center">
            <Upload className="mx-auto text-purple-600 mb-4" size={55} />

            <h3 className="text-2xl font-bold mb-2">Bulk Resume Upload</h3>
            <p className="text-gray-500 mb-6">
              Upload up to 50 PDF resumes at once
            </p>

<select
  value={selectedJobId}
  onChange={(e) => setSelectedJobId(e.target.value)}
  className="w-full mb-5 border border-purple-300 rounded-xl p-3"
>
  <option value="">Select Job Role</option>

  {jobs.map((job) => (
    <option key={job._id} value={job._id}>
      {job.title}
    </option>
  ))}
</select>

            <label className="btn-animated inline-block bg-white border border-purple-300 text-purple-700 px-8 py-4 rounded-xl font-bold cursor-pointer">
              Choose Multiple Resumes
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files || []);

                  if (selectedFiles.length > 50) {
                    alert("Maximum 50 resumes select kar sakte ho");
                    return;
                  }

                  setBulkFiles(selectedFiles);
                  setBulkMessage("");
                }}
              />
            </label>

            {bulkFiles.length > 0 && (
              <div className="mt-5 text-left bg-white rounded-2xl p-4 max-h-40 overflow-y-auto">
                <p className="font-bold text-purple-700 mb-2">
                  Selected Resumes: {bulkFiles.length}
                </p>

                {bulkFiles.map((file, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {index + 1}. {file.name}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={handleBulkUpload}
              className="btn-animated mt-8 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold"
            >
              Bulk Upload & Analyze
            </button>

            {bulkMessage && (
              <p className="mt-5 font-semibold text-purple-700">
                {bulkMessage}
              </p>
            )}
          </div>
        </div>

        {analysis && (
          <div className="mt-8 bg-gray-50 rounded-3xl p-8 border">
            <h2 className="text-2xl font-bold mb-5">
              AI Resume Analysis Result
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card-animated bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">Candidate Name</p>
                <h3 className="text-xl font-bold">{analysis.name}</h3>
              </div>

              <div className="card-animated bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">AI Match Score</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {analysis.scoreDisplay || analysis.score}
                </h3>
              </div>

              <div className="card-animated bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">Email</p>
                <h3 className="font-semibold">{analysis.email}</h3>
              </div>

              <div className="card-animated bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">Phone</p>
                <h3 className="font-semibold">{analysis.phone}</h3>
              </div>
            </div>

            <div className="mt-6 card-animated bg-white p-5 rounded-2xl border">
              <p className="text-gray-500 mb-3">Extracted Skills</p>
              <div className="flex gap-2 flex-wrap">
                {analysis.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 card-animated bg-green-50 border border-green-200 p-5 rounded-2xl">
              <p className="text-gray-500">Recommendation</p>
              <h3 className="text-xl font-bold text-green-700">
                {analysis.recommendation}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Candidates() {
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateType | null>(null);

  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState<any>(null);

 const fetchCandidates = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/candidates",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCandidates(response.data.candidates || []);
  } catch (error) {
    console.log("Candidate fetch failed", error);
  } finally {
    setLoading(false);
  }
};

  const updateStatus = async (id: string | undefined, status: string) => {
    if (!id) return;

    try {
      await axios.put(`http://localhost:5000/api/candidates/${id}/status`, {
        status,
      });

      await fetchCandidates();
      setSelectedCandidate(null);
      alert(`Candidate marked as ${status}`);
    } catch (error) {
      console.log("Status update failed", error);
    }
  };

const deleteCandidate = async (id: string | undefined) => {
  if (!id) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this candidate?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/candidates/${id}`
    );

    await fetchCandidates();
    setSelectedCandidate(null);

    alert("Candidate deleted successfully");
  } catch (error) {
    console.log("Delete candidate failed", error);
    alert("Candidate delete failed");
  }
};

const exportToExcel = () => {
  const excelData = candidates.map((candidate) => ({
    Name: candidate.name,
    Email: candidate.email || "Not Found",
    Skills: Array.isArray(candidate.skills)
      ? candidate.skills.join(", ")
      : candidate.skills,
    Score: candidate.scoreDisplay || candidate.score,
    Status: candidate.status,
    FileName: candidate.fileName || "Uploaded Resume",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

  XLSX.writeFile(workbook, "candidates-report.xlsx");
};

  const handleJobMatch = async () => {
    if (!selectedCandidate?._id) return;

    if (!jobDescription.trim()) {
      alert("Pehle Job Description likho");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/match-job", {
        candidateId: selectedCandidate._id,
        jobDescription,
      });

      setJobMatchResult(response.data.jobMatch);
    } catch (error) {
      console.log("Job matching failed", error);
      alert("Job matching failed");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    candidate.name?.toLowerCase().includes(searchText) ||
    candidate.email?.toLowerCase().includes(searchText) ||
    String(candidate.skills).toLowerCase().includes(searchText);

  const matchesStatus =
    statusFilter === "All" || candidate.status === statusFilter;

  return matchesSearch && matchesStatus;
});

const getNumericScore = (score: string | number) => {
  if (typeof score === "number") return score;
  return parseInt(String(score).replace("%", "")) || 0;
};

const rankedCandidates = [...filteredCandidates].sort(
  (a, b) => getNumericScore(b.score) - getNumericScore(a.score)
);

return (

    <div className="p-4 md:p-6">
  <div className="card-animated bg-white rounded-3xl p-5 md:p-8 shadow-sm overflow-x-hidden">
    <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center mb-6">
      <h2 className="text-2xl font-bold">Candidates</h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button
          onClick={exportToExcel}
          className="btn-animated bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
        >
          📊 Export Excel
        </button>

        <button
          onClick={fetchCandidates}
          className="btn-animated bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold"
        >
          🔄 Refresh
        </button>
      </div>
    </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            className="border p-4 rounded-xl col-span-2"
            placeholder="Search by name, email or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
  className="border p-4 rounded-xl"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="All">All Status</option>
  <option value="Shortlist Candidate">Shortlisted</option>
  <option value="Rejected">Rejected</option>
</select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading candidates...</p>
        ) : filteredCandidates.length === 0 ? (
          <p className="text-gray-500">No matching candidates found.</p>
        ) : (
          <div className="overflow-x-auto">
  <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-4">Candidate</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Skills</th>
                <th className="pb-4">Score</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {rankedCandidates.map((candidate, index) => (
                <tr
                  key={candidate._id || candidate.id || index}
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setJobDescription("");
                    setJobMatchResult(null);
                  }}
                  className="row-animated border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-5 font-semibold">
                    <div>{candidate.name || "Candidate"}</div>
                    {index === 0 && (
                    <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                    🏆 Best Match
                  </span>
                     )}
                    <div className="text-xs text-gray-400 font-normal">
                      {candidate.fileName || "Uploaded Resume"}
                    </div>
                  </td>

                  <td>{candidate.email || "Not Found"}</td>

                  <td>
                    {Array.isArray(candidate.skills)
                      ? candidate.skills.join(", ")
                      : candidate.skills}
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                      {candidate.scoreDisplay || candidate.score}
                    </span>
                  </td>

                  <td>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {candidate.status || "Analyzed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
  <div className="min-h-screen flex items-start md:items-center justify-center p-4 md:p-6">
          <div className="card-animated bg-white rounded-3xl p-5 md:p-8 w-full max-w-2xl shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Candidate Details</h2>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="btn-animated bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="card-animated bg-gray-50 p-5 rounded-2xl">
                <p className="text-gray-500">Name</p>
                <h3 className="font-bold text-xl">{selectedCandidate.name}</h3>
              </div>

              <div className="card-animated bg-gray-50 p-5 rounded-2xl">
                <p className="text-gray-500">Score</p>
                <h3 className="font-bold text-2xl text-green-600">
                  {selectedCandidate.scoreDisplay || selectedCandidate.score}
                </h3>
              </div>

              <div className="card-animated bg-gray-50 p-5 rounded-2xl">
                <p className="text-gray-500">Email</p>
                <h3 className="font-semibold">
                  {selectedCandidate.email || "Not Found"}
                </h3>
              </div>

              <div className="card-animated bg-gray-50 p-5 rounded-2xl">
                <p className="text-gray-500">Status</p>
                <h3 className="font-semibold">{selectedCandidate.status}</h3>
              </div>
            </div>

            <div className="mt-6 card-animated bg-gray-50 p-5 rounded-2xl">
              <p className="text-gray-500 mb-3">Skills</p>

              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedCandidate.skills)
                  ? selectedCandidate.skills
                  : String(selectedCandidate.skills).split(",")
                ).map((skill) => (
                  <span
                    key={skill}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 card-animated bg-gray-50 p-5 rounded-2xl">
              <p className="text-gray-500">Resume File</p>
              <h3 className="font-semibold">
                {selectedCandidate.fileName || "Uploaded Resume"}
              </h3>
            </div>

            <div className="mt-4">
  <button
    onClick={() =>
      window.open(
        `http://localhost:5000/api/candidates/${selectedCandidate._id}/download`,
        "_blank"
      )
    }
    className="btn-animated bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
  >
    📥 Download Resume
  </button>
</div>

            <div className="mt-6 flex gap-3 flex-wrap">
  <button
    onClick={() =>
      updateStatus(selectedCandidate._id, "Shortlist Candidate")
    }
    className="btn-animated bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
  >
    ✅ Shortlist
  </button>

  <button
    onClick={() => updateStatus(selectedCandidate._id, "Rejected")}
    className="btn-animated bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
  >
    ❌ Reject
  </button>

  <button
    onClick={() => deleteCandidate(selectedCandidate._id)}
    className="btn-animated bg-black text-white px-5 py-3 rounded-xl font-bold"
  >
    🗑️ Delete Candidate
  </button>
</div>

            <div className="mt-6 card-animated bg-purple-50 border border-purple-200 p-5 rounded-2xl">
              <h3 className="font-bold text-xl mb-3">
                Job Description Matching
              </h3>

              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here... Example: React, TypeScript, Node.js, MongoDB"
                className="w-full border p-4 rounded-xl"
              />

              <button
                onClick={handleJobMatch}
                className="btn-animated mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Match With Job
              </button>

              {jobMatchResult && (
              <div className="mt-5 bg-white border rounded-2xl p-5">

              <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
               Job Match Result
               </h3>

               <button
                onClick={() => setJobMatchResult(null)}
                 className="btn-animated bg-red-500 text-white px-4 py-2 rounded-xl"
                 >
                  Close
                </button>
                 </div>

                  <p>
                    <b>Match Score:</b> {jobMatchResult.matchScore}
                  </p>

                  <p className="mt-2">
                    <b>Recommendation:</b> {jobMatchResult.recommendation}
                  </p>

                  <div className="mt-4">
                    <p className="font-bold text-green-700">
                      Matched Skills:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {jobMatchResult.matchedSkills?.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="font-bold text-red-700">
                      Missing Skills:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {jobMatchResult.missingSkills?.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
                   </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [matchedCandidates, setMatchedCandidates] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const fetchJobs = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:5000/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setJobs(response.data.jobs || []);
  } catch (error) {
    console.log("Jobs fetch failed", error);
  }
};

  const matchCandidates = async (job: any) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://localhost:5000/api/jobs/${job._id}/match-candidates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMatchedCandidates(response.data.matches || []);
    setSelectedJob(job);
  } catch (error) {
    console.log("Matching failed", error);
    alert("Candidate matching failed");
  }
};

  const createJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !skills.trim()) {
  alert("Job Title and Required Skills are required");
  return;
}

    try {
      const token = localStorage.getItem("token");

await axios.post(
  "http://localhost:5000/api/jobs",
  {
    title,
    skills,
    experience,
    location,
    salary,
    description,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setTitle("");
      setSkills("");
      setExperience("");
      setLocation("");
      setSalary("");
      setDescription("");
      setShowForm(false);

      fetchJobs();
      alert("Job created successfully");
    } catch (error) {
      console.log("Job create failed", error);
      alert("Job create failed");
    }
  };

  const deleteJob = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchJobs();
    alert("Job deleted successfully");
  } catch (error) {
    console.log("Job delete failed", error);
    alert("Job delete failed");
  }
};

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Jobs</h2>
          <p className="text-gray-500">
            Create jobs and manage openings for resume screening.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-animated bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          + Create Job
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <form
            onSubmit={createJob}
            className="bg-white rounded-3xl p-5 md:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Create New Job</h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-animated bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>

<label className="font-bold mb-2 block">
  Job Title <span className="text-red-500">*</span>
</label>

            <input
              className="w-full border p-4 rounded-xl mb-4"
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

<label className="font-bold mb-2 block">
  Required Skills <span className="text-red-500">*</span>
</label>

            <input
              className="w-full border p-4 rounded-xl mb-4"
              placeholder="Required Skills comma separated, e.g. React, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="border p-4 rounded-xl mb-4"
                placeholder="Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

              <input
                className="border p-4 rounded-xl mb-4"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                className="border p-4 rounded-xl mb-4"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <textarea
              className="w-full border p-4 rounded-xl mb-4"
              rows={5}
              placeholder="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className="btn-animated bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold">
              Save Job
            </button>
          </form>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <p className="text-gray-500">No jobs created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="card-animated bg-white p-8 rounded-3xl shadow-sm"
            >
              <h2 className="text-2xl font-bold">{job.title}</h2>

              <p className="text-gray-500 mt-3">
                {job.description || "No description added."}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Experience</p>
                  <b>{job.experience || "N/A"}</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Location</p>
                  <b>{job.location || "N/A"}</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Salary</p>
                  <b>{job.salary || "N/A"}</b>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => matchCandidates(job)}
                  className="btn-animated bg-purple-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Match Candidates
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="btn-animated bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-5xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Top Matches - {selectedJob.title}
              </h2>

              <button
                onClick={() => {
                  setSelectedJob(null);
                  setMatchedCandidates([]);
                }}
                className="btn-animated bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4">Candidate</th>
                  <th className="pb-4">Match Score</th>
                  <th className="pb-4">Matched Skills</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {matchedCandidates.map((candidate) => (
                  <tr key={candidate.candidateId} className="border-b">
                    <td className="py-4">
                      <div className="font-bold">{candidate.name}</div>
                      <div className="text-sm text-gray-500">
                        {candidate.email}
                      </div>
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                        {candidate.matchScore}%
                      </span>
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-2">
                        {candidate.matchedSkills.map((skill: string) => (
                          <span
                            key={skill}
                            className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>{candidate.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="card-animated bg-white rounded-3xl p-5 md:p-8 shadow-sm w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">Settings</h2>

        <input className="w-full border p-4 rounded-xl mb-4" placeholder="Company Name" />
        <input className="w-full border p-4 rounded-xl mb-4" placeholder="Recruiter Email" />

        <button className="btn-animated bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold">
          Save Settings
        </button>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="card-animated bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-gray-100 hover:shadow-2xl">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default App;