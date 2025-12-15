import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// File paths for persistent storage
const surveysFile = path.join(__dirname, "surveys.json");
const issuesFile = path.join(__dirname, "issues.json");

// In-memory storage
let surveys = [];
let issues = [];
let surveyIdCounter = 0;
let issueIdCounter = 0;

// Load data from files on startup
function loadData() {
  try {
    if (fs.existsSync(surveysFile)) {
      const data = fs.readFileSync(surveysFile, "utf8");
      surveys = JSON.parse(data);
      if (surveys.length > 0) {
        surveyIdCounter = Math.max(...surveys.map(s => s.id)) + 1;
      }
      console.log(`✅ Loaded ${surveys.length} surveys from file`);
    }
  } catch (err) {
    console.error("Error loading surveys:", err);
    surveys = [];
  }

  try {
    if (fs.existsSync(issuesFile)) {
      const data = fs.readFileSync(issuesFile, "utf8");
      issues = JSON.parse(data);
      if (issues.length > 0) {
        issueIdCounter = Math.max(...issues.map(i => i.id)) + 1;
      }
      console.log(`✅ Loaded ${issues.length} issues from file`);
    }
  } catch (err) {
    console.error("Error loading issues:", err);
    issues = [];
  }
}

// Save surveys to file
function saveSurveys() {
  try {
    fs.writeFileSync(surveysFile, JSON.stringify(surveys, null, 2));
    console.log("💾 Surveys saved to file");
  } catch (err) {
    console.error("Error saving surveys:", err);
  }
}

// Save issues to file
function saveIssues() {
  try {
    fs.writeFileSync(issuesFile, JSON.stringify(issues, null, 2));
    console.log("💾 Issues saved to file");
  } catch (err) {
    console.error("Error saving issues:", err);
  }
}

// Load data on startup
loadData();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Clean Water & Sanitation Backend Running ✅" });
});

// Survey submission
app.post("/survey", (req, res) => {
  try {
    if (!req.body.name || req.body.usage === undefined || req.body.usage === null || req.body.usage === "") {
      return res.status(400).json({ error: "Name and usage required" });
    }
    const survey = {
      id: surveyIdCounter++,
      name: req.body.name.trim(),
      usage: parseInt(req.body.usage),
      timestamp: req.body.timestamp || new Date().toLocaleString()
    };
    surveys.push(survey);
    saveSurveys(); // ✅ Save to file
    console.log("Survey submitted:", survey);
    res.status(200).json({ message: "✅ Survey submitted successfully!", data: survey });
  } catch (err) {
    console.error("Error in POST /survey:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete survey by ID
app.delete("/survey/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = surveys.findIndex(survey => survey.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: `Survey with ID ${id} not found` });
    }
    
    const deleted = surveys.splice(index, 1);
    saveSurveys(); // ✅ Save to file after deletion
    console.log("Survey deleted:", deleted[0]);
    res.status(200).json({ message: "✅ Survey deleted successfully!", data: deleted[0] });
  } catch (err) {
    console.error("Error in DELETE /survey/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Issue reporting
app.post("/issue", (req, res) => {
  try {
    if (!req.body.location || !req.body.problem) {
      return res.status(400).json({ error: "Location and problem required" });
    }
    const issue = {
      id: issueIdCounter++,
      location: req.body.location.trim(),
      problem: req.body.problem.trim(),
      timestamp: req.body.timestamp || new Date().toLocaleString()
    };
    issues.push(issue);
    saveIssues(); // ✅ Save to file
    console.log("Issue reported:", issue);
    res.status(200).json({ message: "✅ Issue reported successfully!", data: issue });
  } catch (err) {
    console.error("Error in POST /issue:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete issue by ID
app.delete("/issue/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = issues.findIndex(issue => issue.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: `Issue with ID ${id} not found` });
    }
    
    const deleted = issues.splice(index, 1);
    saveIssues(); // ✅ Save to file after deletion
    console.log("Issue deleted:", deleted[0]);
    res.status(200).json({ message: "✅ Issue deleted successfully!", data: deleted[0] });
  } catch (err) {
    console.error("Error in DELETE /issue/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// View all data
app.get("/data", (req, res) => {
  try {
    res.status(200).json({ 
      surveys,
      issues,
      totalSurveys: surveys.length,
      totalIssues: issues.length,
      timestamp: new Date().toLocaleString()
    });
  } catch (err) {
    console.error("Error in GET /data:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🌍 Backend running at http://localhost:${PORT}`);
  console.log(`✅ Server is ready to accept requests`);
  console.log(`📁 Data files:`);
  console.log(`   - Surveys: ${surveysFile}`);
  console.log(`   - Issues: ${issuesFile}`);
});
