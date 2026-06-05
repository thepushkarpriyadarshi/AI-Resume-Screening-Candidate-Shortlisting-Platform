export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <h1 className="text-5xl font-bold">
        Recruitment Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome Recruiter 👋
      </p>

      <div className="grid grid-cols-4 gap-6 mt-10">

        <div className="bg-white p-6 rounded-3xl">
          <h3>Total Candidates</h3>
          <h1 className="text-4xl font-bold mt-2">245</h1>
        </div>

        <div className="bg-white p-6 rounded-3xl">
          <h3>Shortlisted</h3>
          <h1 className="text-4xl font-bold mt-2">32</h1>
        </div>

        <div className="bg-white p-6 rounded-3xl">
          <h3>Rejected</h3>
          <h1 className="text-4xl font-bold mt-2">18</h1>
        </div>

        <div className="bg-white p-6 rounded-3xl">
          <h3>Hired</h3>
          <h1 className="text-4xl font-bold mt-2">8</h1>
        </div>

      </div>

    </div>
  );
}