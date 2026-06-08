const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const dns = require("dns");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const pdfParse = require("pdf-parse/lib/pdf-parse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

// MongoDB Atlas SRV DNS fix
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* MongoDB Connection */
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err.message));

const candidateSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    score: String,
    status: String,
    fileName: String,
    filePath: String,
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
const jobSchema = new mongoose.Schema(
  {
    title: String,
    skills: [String],
    experience: String,
    location: String,
    salary: String,
    description: String,
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/* Multer Setup */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

/* Extract Functions */

function calculateJobMatch(resumeSkills, jobDescription) {
  const jdText = jobDescription.toLowerCase();

  const requiredSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Python",
    "Java",
    "C++",
    "SQL",
    "Git",
    "TypeScript",
    "Machine Learning",
    "Data Analysis",
  ].filter((skill) => jdText.includes(skill.toLowerCase()));

  const matchedSkills = resumeSkills.filter((skill) =>
    requiredSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !resumeSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const matchScore =
    requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

  return {
    requiredSkills,
    matchedSkills,
    missingSkills,
    matchScore: matchScore + "%",
    recommendation:
      matchScore >= 75
        ? "Strong Match"
        : matchScore >= 50
        ? "Average Match"
        : "Weak Match",
  };
}


function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "Not Found";
}

function extractPhone(text) {
  const match = text.match(/(\+91[\s-]?)?[6-9]\d{9}/);
  return match ? match[0] : "Not Found";
}

function extractName(text, fileName) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines[0] || fileName.replace(".pdf", "");
}

function extractSkills(text) {
  const skillsList = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Python",
    "Java",
    "C++",
    "SQL",
    "Git",
    "TypeScript",
    "Machine Learning",
    "Data Analysis",
  ];

  return skillsList.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function calculateScore(skills) {
  return Math.min(95, skills.length * 12 + 35);
}

/* Routes */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "hiresmart_secret",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/api/db-status", (req, res) => {
  res.json({
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
  });
});

app.post("/api/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileBuffer = await fs.promises.readFile(req.file.path);
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text || "";

    const skills = extractSkills(text);
    const scoreValue = calculateScore(skills);

    const analysis = {
      name: extractName(text, req.file.originalname),
      email: extractEmail(text),
      phone: extractPhone(text),
      skills: skills.length ? skills : ["No major skills found"],
      score: scoreValue + "%",
      recommendation:
        scoreValue >= 75 ? "Shortlist Candidate" : "Needs Manual Review",
    };

    let savedCandidate = null;

    if (mongoose.connection.readyState === 1) {
      savedCandidate = await Candidate.create({
        name: analysis.name,
        email: analysis.email,
        phone: analysis.phone,
        skills: analysis.skills,
        score: analysis.score,
        status: analysis.recommendation,
        fileName: req.file.originalname,
        filePath: req.file.path,
      });
    }

    res.json({
      success: true,
      message: "Resume Uploaded",
      analysis,
      candidate: savedCandidate,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Resume Processing Failed",
      error: error.message,
    });
  }
});

app.post("/api/upload/bulk", upload.array("resumes", 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const results = [];

    for (const file of req.files) {
      try {
        const fileBuffer = await fs.promises.readFile(file.path);
        const pdfData = await pdfParse(fileBuffer);
        const text = pdfData.text || "";

        const skills = extractSkills(text);
        const scoreValue = calculateScore(skills);

        const analysis = {
          name: extractName(text, file.originalname),
          email: extractEmail(text),
          phone: extractPhone(text),
          skills: skills.length ? skills : ["No major skills found"],
          score: scoreValue + "%",
          recommendation:
            scoreValue >= 75 ? "Shortlist Candidate" : "Needs Manual Review",
        };

        let savedCandidate = null;

        if (mongoose.connection.readyState === 1) {
          savedCandidate = await Candidate.create({
            name: analysis.name,
            email: analysis.email,
            phone: analysis.phone,
            skills: analysis.skills,
            score: analysis.score,
            status: analysis.recommendation,
            fileName: file.originalname,
            filePath: file.path,
          });
        }

        results.push({
          success: true,
          fileName: file.originalname,
          analysis,
          candidate: savedCandidate,
        });
      } catch (fileError) {
        results.push({
          success: false,
          fileName: file.originalname,
          error: fileError.message,
        });
      }
    }

    res.json({
      success: true,
      message: `${results.length} resumes processed`,
      results,
    });
  } catch (error) {
    console.log("BULK UPLOAD ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Bulk Resume Processing Failed",
      error: error.message,
    });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        stats: {
          totalCandidates: 0,
          shortlisted: 0,
          manualReview: 0,
          rejected: 0,
          averageScore: "0%",
        },
      });
    }

    const candidates = await Candidate.find();

    const totalCandidates = candidates.length;

    const shortlisted = candidates.filter(
      (candidate) => candidate.status === "Shortlist Candidate"
    ).length;

    const manualReview = candidates.filter(
      (candidate) => candidate.status === "Needs Manual Review"
    ).length;

    const rejected = candidates.filter(
      (candidate) => candidate.status === "Rejected"
    ).length;

    const totalScore = candidates.reduce((sum, candidate) => {
      const score = parseInt(candidate.score?.replace("%", "") || "0");
      return sum + score;
    }, 0);

    const averageScore =
      candidates.length > 0
        ? Math.round(totalScore / candidates.length) + "%"
        : "0%";

    res.json({
      success: true,
      stats: {
        totalCandidates,
        shortlisted,
        manualReview,
        rejected,
        averageScore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Stats Fetch Failed",
      error: error.message,
    });
  }
});

app.get("/api/candidates", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        candidates: [],
      });
    }

    const candidates = await Candidate.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Candidates Fetch Failed",
      error: error.message,
    });
  }
});

app.put("/api/candidates/:id/status", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "MongoDB not connected",
      });
    }

    const { status } = req.body;

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.json({
      success: true,
      message: "Candidate status updated",
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Status update failed",
      error: error.message,
    });
  }
});

app.post("/api/match-job", async (req, res) => {
  try {
    const { candidateId, jobDescription } = req.body;

    if (!candidateId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "candidateId and jobDescription are required",
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const matchResult = calculateJobMatch(
      candidate.skills || [],
      jobDescription
    );

    res.json({
      success: true,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
      },
      jobMatch: matchResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job matching failed",
      error: error.message,
    });
  }
});

app.delete("/api/candidates/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.json({
      success: true,
      message: "Candidate deleted successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
});

app.get("/api/candidates/:id/download", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    let resumePath = candidate.filePath;

    if (!resumePath && candidate.fileName) {
      const files = fs.readdirSync("uploads");

      const matchedFile = files.find((file) =>
        file.toLowerCase().includes(candidate.fileName.toLowerCase())
      );

      if (matchedFile) {
        resumePath = "uploads/" + matchedFile;
      }
    }

    if (!resumePath || !fs.existsSync(resumePath)) {
      return res.status(404).json({
        success: false,
        message:
          "Resume file not found. This old candidate may need to upload resume again.",
      });
    }

    res.download(resumePath, candidate.fileName || "resume.pdf");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Resume download failed",
      error: error.message,
    });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const { title, skills, experience, location, salary, description } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    const job = await Job.create({
      title,
      skills: Array.isArray(skills)
        ? skills
        : String(skills || "")
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
      experience,
      location,
      salary,
      description,
    });

    res.json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job create failed",
      error: error.message,
    });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Jobs fetch failed",
      error: error.message,
    });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job delete failed",
      error: error.message,
    });
  }
});

app.get("/api/jobs/:id/match-candidates", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const candidates = await Candidate.find();

    const results = candidates.map((candidate) => {
      const candidateSkills = (candidate.skills || []).map((skill) =>
        skill.toLowerCase()
      );

      const jobSkills = (job.skills || []).map((skill) =>
        skill.toLowerCase()
      );

      const matchedSkills = jobSkills.filter((skill) =>
        candidateSkills.includes(skill)
      );

      const missingSkills = jobSkills.filter(
        (skill) => !candidateSkills.includes(skill)
      );

      const matchScore =
        jobSkills.length > 0
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;

      return {
        candidateId: candidate._id,
        name: candidate.name,
        email: candidate.email,
        score: candidate.score,
        status: candidate.status,
        matchedSkills,
        missingSkills,
        matchScore,
      };
    });

    results.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      job,
      matches: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Matching failed",
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});