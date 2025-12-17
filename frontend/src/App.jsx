import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Use environment variable for API URL
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const [name, setName] = useState("");
  const [usage, setUsage] = useState("");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [allData, setAllData] = useState({ surveys: [], issues: [] });
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
    setMobileMenuOpen(false); // Close menu after clicking
  };

  const submitSurvey = async () => {
    if (!name || !usage) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await fetch(`${API}/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, usage: parseInt(usage), timestamp: new Date().toLocaleString() })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      alert(data.message);
      setName("");
      setUsage("");
      fetchAllData();
    } catch (err) {
      alert("Error submitting survey: " + err.message);
    }
  };

  const deleteSurvey = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;
    
    try {
      const response = await fetch(`${API}/survey/${id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || `HTTP error! status: ${response.status}`);
      
      alert(data.message);
      fetchAllData();
    } catch (err) {
      alert("Error deleting survey: " + err.message);
    }
  };

  const reportIssue = async () => {
    if (!location || !problem) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await fetch(`${API}/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, problem, timestamp: new Date().toLocaleString() })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      alert(data.message);
      setLocation("");
      setProblem("");
      fetchAllData();
    } catch (err) {
      alert("Error reporting issue: " + err.message);
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    
    try {
      const response = await fetch(`${API}/issue/${id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || `HTTP error! status: ${response.status}`);
      
      alert(data.message);
      fetchAllData();
    } catch (err) {
      alert("Error deleting issue: " + err.message);
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await fetch(`${API}/data`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setAllData(data);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Unable to connect to backend. Make sure the server is running.");
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <img 
            src="/logo.png" 
            alt="Clean Water & Sanitation Logo" 
            className="logo-img"
          />
        </div>
        
        <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#awareness" onClick={(e) => { e.preventDefault(); smoothScrollTo("awareness"); }}>Awareness</a></li>
          <li><a href="#survey" onClick={(e) => { e.preventDefault(); smoothScrollTo("survey"); }}>Survey</a></li>
          <li><a href="#issues" onClick={(e) => { e.preventDefault(); smoothScrollTo("issues"); }}>Report Issue</a></li>
          <li><a href="#data" onClick={(e) => { e.preventDefault(); smoothScrollTo("data"); }}>Data</a></li>
        </ul>
      </nav>

      {error && <div className="error-banner"><p>{error}</p></div>}

      <section className="hero">
        <div className="hero-content">
          <h1>CLEAN WATER<br />AND SANITATION</h1>
          <p>We are dedicated to providing clean water and sanitation solutions to every household. Join our mission today and be part of the change.</p>
          <button className="cta-button" onClick={() => smoothScrollTo("awareness")}>GET STARTED</button>
        </div>
        <div className="hero-image">
          <img src="/water-hero.png" alt="Clean Water and Sanitation" className="hero-illustration" />
        </div>
      </section>

      <section className="awareness-section" id="awareness">
        <div className="section-container">
          <h2>Why Clean Water Matters</h2>
          <div className="facts-grid">
            <div className="fact-card">
              <div className="fact-icon">💧</div>
              <h3>2.2 Billion People</h3>
              <p>Lack safe drinking water globally</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">🏥</div>
              <h3>Prevents Diseases</h3>
              <p>Clean water reduces waterborne diseases by 50%</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">👨‍👩‍👧‍👦</div>
              <h3>Impacts Health</h3>
              <p>Improves life expectancy and child mortality rates</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">🌍</div>
              <h3>Environment</h3>
              <p>Protects ecosystems and biodiversity</p>
            </div>
          </div>
        </div>
      </section>

      <section className="survey-section" id="survey">
        <div className="section-container">
          <h2>📊 Water Usage Survey</h2>
          <p className="section-subtitle">Help us understand water consumption patterns</p>
          <div className="form-group">
            <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="input-field" />
            <input type="number" placeholder="Daily Water Usage (Liters)" value={usage} onChange={e => setUsage(e.target.value)} className="input-field" min="0" />
            <button onClick={submitSurvey} className="submit-button">Submit Survey</button>
          </div>
        </div>
      </section>

      <section className="issue-section" id="issues">
        <div className="section-container">
          <h2>🚨 Report Water / Sanitation Issue</h2>
          <p className="section-subtitle">Help us identify and fix water problems in your area</p>
          <div className="form-group">
            <input type="text" placeholder="Location (e.g., Street Name, City)" value={location} onChange={e => setLocation(e.target.value)} className="input-field" />
            <textarea placeholder="Issue Description (e.g., Leaking tap, No water supply, Contamination)" value={problem} onChange={e => setProblem(e.target.value)} className="input-field" rows="4" />
            <button onClick={reportIssue} className="submit-button">Report Issue</button>
          </div>
        </div>
      </section>

      <section className="data-section" id="data">
        <div className="section-container">
          <h2>📈 Collected Data</h2>
          <button onClick={fetchAllData} className="refresh-button">Refresh Data</button>

          <div className="data-grid">
            <div className="data-card">
              <h3>Surveys Submitted: {allData.surveys.length}</h3>
              <div className="data-list">
                {allData.surveys.length === 0 ? (
                  <p className="empty-msg">No surveys yet</p>
                ) : (
                  allData.surveys.map((survey) => (
                    <div key={survey.id} className="data-item">
                      <div className="data-content">
                        <strong>{survey.name}</strong> - {survey.usage}L/day
                        <small>{survey.timestamp}</small>
                      </div>
                      <button onClick={() => deleteSurvey(survey.id)} className="delete-button" title="Delete survey">
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="data-card">
              <h3>Issues Reported: {allData.issues.length}</h3>
              <div className="data-list">
                {allData.issues.length === 0 ? (
                  <p className="empty-msg">No issues reported</p>
                ) : (
                  allData.issues.map((issue) => (
                    <div key={issue.id} className="data-item">
                      <div className="data-content">
                        <strong>{issue.location}</strong> - {issue.problem}
                        <small>{issue.timestamp}</small>
                      </div>
                      <button onClick={() => deleteIssue(issue.id)} className="delete-button" title="Delete issue">
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Clean Water & Sanitation | SCR Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
