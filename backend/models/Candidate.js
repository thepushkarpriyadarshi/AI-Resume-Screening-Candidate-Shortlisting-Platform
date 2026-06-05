const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  skills: [String],
  score: String,
  status: String,
  resumeFile: String,
});

module.exports = mongoose.model("Candidate", candidateSchema);