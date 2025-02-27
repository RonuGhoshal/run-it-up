import { useState } from "react";
import "./Home.css"; // Import the CSS file

export default function Home() {
  const [plan, setPlan] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    setPlan(data.plan);
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>Running Plan Generator</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Race Date</label>
            <input name="race_date" type="date" required />
          </div>
          <div className="form-group">
            <label>Race Distance (miles)</label>
            <input name="race_distance" type="number" step="0.1" required />
          </div>
          <div className="form-group">
            <label>Experience Level</label>
            <select name="experience_level" required>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label>Runs Per Week</label>
            <input name="runs_per_week" type="number" required />
          </div>
          <button type="submit">Generate Plan</button>
        </form>

        {plan && (
          <div className="plan-container">
            <h3>Generated Plan</h3>
            <pre>{JSON.stringify(plan, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
