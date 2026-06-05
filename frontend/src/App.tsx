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

type CandidateType = {
  id?: number;
  name: string;
  role?: string;
  skills: string[] | string;
  score: string;
  status: string;
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
  const isLogin = localStorage.getItem("isLogin");
  return isLogin ? children : <Navigate to="/login" />;
}

function Login() {
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem("isLogin", "true");
    navigate("/dashboard");
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
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-4xl font-bold mb-2">Login</h2>
          <p className="text-gray-500 mb-8">Welcome back recruiter</p>

          <input className="w-full border p-4 rounded-xl mb-4" placeholder="Email" type="email" required />
          <input className="w-full border p-4 rounded-xl mb-6" placeholder="Password" type="password" required />

          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Login</button>

          <p className="text-center mt-6">
            Don’t have account? <Link to="/register" className="text-indigo-600 font-bold">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem("isLogin", "true");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-[#f5f7ff]">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0f172a] to-[#7c3aed] text-white items-center justify-center p-16">
        <div>
          <h1 className="text-6xl font-bold">Create Account</h1>
          <p className="text-xl mt-5 text-gray-200">Start hiring smarter with AI</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleRegister} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-4xl font-bold mb-2">Register</h2>
          <p className="text-gray-500 mb-8">Create recruiter account</p>

          <input className="w-full border p-4 rounded-xl mb-4" placeholder="Full Name" required />
          <input className="w-full border p-4 rounded-xl mb-4" placeholder="Email" type="email" required />
          <input className="w-full border p-4 rounded-xl mb-6" placeholder="Password" type="password" required />

          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Create Account</button>

          <p className="text-center mt-6">
            Already have account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("isLogin");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex">
      <aside className="w-[260px] bg-[#071028] text-white p-6">
        <h1 className="text-2xl font-bold mb-10">HireSmart AI</h1>

        <SideLink to="/dashboard" icon={<LayoutDashboard />} text="Dashboard" />
        <SideLink to="/jobs" icon={<Briefcase />} text="Jobs" />
        <SideLink to="/candidates" icon={<Users />} text="Candidates" />
        <SideLink to="/upload" icon={<Upload />} text="Resume Upload" />
        <SideLink to="/settings" icon={<Settings />} text="Settings" />

        <button onClick={logout} className="mt-10 bg-red-500 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1">
        <nav className="bg-white px-8 py-5 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-3xl font-bold">Recruitment Dashboard</h1>
            <p className="text-gray-500">AI powered hiring overview</p>
          </div>

          <div className="flex gap-4 items-center">
            <Bell className="text-gray-500" />
            <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl">+ Create Job</button>
          </div>
        </nav>

        {children}
      </main>
    </div>
  );
}

function SideLink({ to, icon, text }: { to: string; icon: ReactNode; text: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-4 mb-3 rounded-xl ${isActive ? "bg-indigo-600" : "hover:bg-white/10"}`
      }
    >
      {icon}
      {text}
    </NavLink>
  );
}

function Dashboard() {
  return (
    <>
      <section className="m-6 bg-gradient-to-r from-[#0f172a] via-[#312e81] to-[#7c3aed] rounded-[35px] p-10 text-white shadow-2xl">
        <h1 className="text-5xl font-bold leading-tight">
          AI Resume Screening & <span className="text-purple-300">Candidate Shortlisting</span>
        </h1>
        <p className="mt-5 text-gray-200 text-lg">
          Screen resumes, analyze candidates, and hire faster with AI scoring.
        </p>
      </section>

      <section className="px-6 grid grid-cols-4 gap-6">
        <Card title="Total Jobs" value="12" />
        <Card title="Candidates" value="245" />
        <Card title="Shortlisted" value="32" />
        <Card title="Hired" value="8" />
      </section>
    </>
  );
}

function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<{
    name: string;
    email: string;
    phone: string;
    skills: string[];
    score: string;
    recommendation: string;
  } | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Pehle Choose PDF Resume button se file select karo");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData);

      setMessage(response.data.message);

      const backendAnalysis = response.data.analysis || {
        name: file.name.replace(".pdf", ""),
        email: "candidate@email.com",
        phone: "+91 9876543210",
        skills: ["React", "Node.js", "MongoDB", "JavaScript"],
        score: "92%",
        recommendation: "Shortlist Candidate",
      };

      setAnalysis(backendAnalysis);
    } catch (error) {
      setMessage("Upload Failed");
      setAnalysis(null);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl p-10 shadow-sm">
        <h2 className="text-3xl font-bold mb-3">Upload Resume</h2>
        <p className="text-gray-500 mb-8">Upload PDF resume for AI screening.</p>

        <div className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-3xl p-12 text-center">
          <FileText className="mx-auto text-indigo-600 mb-4" size={60} />

          <h3 className="text-2xl font-bold mb-2">Choose Resume PDF</h3>
          <p className="text-gray-500 mb-6">Only PDF files supported</p>

          <label className="inline-block bg-white border border-indigo-300 text-indigo-700 px-8 py-4 rounded-xl font-bold cursor-pointer">
            Choose PDF Resume
            <input
              type="file"
              accept="application/pdf,.pdf"
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

          <br />

          <button
            onClick={handleUpload}
            className="mt-8 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold"
          >
            Upload & Analyze
          </button>

          {message && (
            <p className="mt-5 font-semibold text-green-600">
              {message}
            </p>
          )}
        </div>

        {analysis && (
          <div className="mt-8 bg-gray-50 rounded-3xl p-8 border">
            <h2 className="text-2xl font-bold mb-5">AI Resume Analysis Result</h2>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">Candidate Name</p>
                <h3 className="text-xl font-bold">{analysis.name}</h3>
              </div>

              <div className="bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">AI Match Score</p>
                <h3 className="text-3xl font-bold text-green-600">{analysis.score}</h3>
              </div>

              <div className="bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">Email</p>
                <h3 className="font-semibold">{analysis.email}</h3>
              </div>

              <div className="bg-white p-5 rounded-2xl border">
                <p className="text-gray-500">Phone</p>
                <h3 className="font-semibold">{analysis.phone}</h3>
              </div>
            </div>

            <div className="mt-6 bg-white p-5 rounded-2xl border">
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

            <div className="mt-6 bg-green-50 border border-green-200 p-5 rounded-2xl">
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

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/candidates");
      setCandidates(response.data.candidates || []);
    } catch (error) {
      console.log("Candidate fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const defaultCandidates: CandidateType[] = [
    {
      name: "John Doe",
      role: "Full Stack Developer",
      skills: ["React", "Node.js"],
      score: "95%",
      status: "Shortlisted",
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      skills: ["Python", "MongoDB"],
      score: "88%",
      status: "In Review",
    },
    {
      name: "Aman Sharma",
      role: "React Developer",
      skills: ["JavaScript", "React"],
      score: "82%",
      status: "Pending",
    },
  ];

  const allCandidates = candidates.length > 0 ? candidates : defaultCandidates;

  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Candidates</h2>

          <button
            onClick={fetchCandidates}
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading candidates...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-4">Candidate</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Skills</th>
                <th className="pb-4">Score</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {allCandidates.map((candidate, index) => (
                <Candidate
                  key={candidate.id || index}
                  name={candidate.name || "Candidate"}
                  role={candidate.role || "Uploaded Resume"}
                  skills={
                    Array.isArray(candidate.skills)
                      ? candidate.skills.join(", ")
                      : candidate.skills
                  }
                  score={candidate.score || "92%"}
                  status={candidate.status || "Analyzed"}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Jobs() {
  const jobs = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "AI/ML Intern"];

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {jobs.map((job) => (
        <div key={job} className="bg-white p-8 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold">{job}</h2>
          <p className="text-gray-500 mt-3">AI will match resumes with this job description.</p>
          <button className="mt-6 bg-indigo-600 text-white px-5 py-3 rounded-xl">View Applicants</button>
        </div>
      ))}
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">Settings</h2>

        <input className="w-full border p-4 rounded-xl mb-4" placeholder="Company Name" />
        <input className="w-full border p-4 rounded-xl mb-4" placeholder="Recruiter Email" />

        <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold">Save Settings</button>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Candidate({
  name,
  role,
  skills,
  score,
  status,
}: {
  name: string;
  role: string;
  skills: string;
  score: string;
  status: string;
}) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-5 font-semibold">{name}</td>
      <td>{role}</td>
      <td>{skills}</td>
      <td>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">{score}</span>
      </td>
      <td>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{status}</span>
      </td>
    </tr>
  );
}

export default App;