const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const pdfParse = require("pdf-parse/lib/pdf-parse");

dotenv.config();

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
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});