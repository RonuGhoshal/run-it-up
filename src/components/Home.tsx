import { useState } from "react";
import "./Home.css"; // Import the CSS file
import { API_URL } from "../constants";
type RunType = {
  day: string;
  type: string;
  distance: number;
  description: string;
};

type WeekType = {
  weekNumber: number;
  totalMileage: number;
  runs: RunType[];
};

type PlanType = {
  weeks: WeekType[];
};

export default function Home() {
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error| null>(null);

  async function handleSubmit(event: React.BaseSyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error state before making a new request
    try {
      const formData = new FormData(event.target);
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <header>
        <img style={{ width: "100%", height: "auto" }} src="src/assets/runitup.jpg" alt="Run It Up" />
      </header>
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

        {isLoading && <p className="loading-animation">Generating plan...</p>}

        {error && <p className="error-message">Unable to generate plan.</p>}

        {plan && !isLoading && (
          <div className="plan-container">
            <h3>Running Plan</h3>
            {plan.weeks.map((week, index) => (
              <div key={index} className="week-plan">
                <h4>Week {week.weekNumber}</h4>
                <p>Total Mileage: {week.totalMileage} miles</p>
                <ul>
                  {week.runs.map((run, runIndex) => (
                    <li key={runIndex}>
                      <strong>{run.day}.</strong> {run.type} - {run.distance} miles: <em>{run.description}</em>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
