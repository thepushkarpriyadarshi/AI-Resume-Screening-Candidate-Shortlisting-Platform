const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-100">

      <nav className="bg-black text-white px-10 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-violet-400">
          HireSmart AI
        </h1>

        <div className="flex gap-6">
          <a href="#">Features</a>
          <a href="#">Dashboard</a>
          <a href="#">Candidates</a>
          <a href="#">Contact</a>
        </div>

        <button className="bg-violet-600 px-5 py-2 rounded-lg">
          Get Started
        </button>
      </nav>

      <section className="grid grid-cols-2 px-20 py-20 items-center">

        <div>
          <h1 className="text-6xl font-bold leading-tight">
            AI Resume Screening &{" "}
            <span className="text-violet-600">
              Candidate Shortlisting
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Automate your hiring process using AI powered recruitment analysis.
          </p>

          <div className="flex gap-5 mt-8">
            <button className="bg-violet-600 text-white px-6 py-3 rounded-xl">
              Get Started
            </button>

            <button className="border px-6 py-3 rounded-xl bg-white">
              Book Demo
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};

export default Landing;