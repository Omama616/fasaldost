export default function Dashboard({ fields, expenses, diagnoses }) {
  const totalArea = fields.reduce((sum, f) => sum + (parseFloat(f.area) || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const issuesFound = diagnoses.filter((d) => d.result && d.result.isHealthy === false).length;

  return (
    <div>
      <div className="card">
        <h2>Welcome back 🌾</h2>
        <p className="muted">
          Here is a quick look at your farm. Use the tabs above to add fields, diagnose crop
          problems, ask farming questions, or log expenses.
        </p>
        <div className="stat-grid">
          <div className="stat-box">
            <div className="num">{fields.length}</div>
            <div className="label">Fields tracked</div>
          </div>
          <div className="stat-box">
            <div className="num">{totalArea || 0}</div>
            <div className="label">Total acres</div>
          </div>
          <div className="stat-box">
            <div className="num">Rs {totalSpent.toLocaleString()}</div>
            <div className="label">Total spent</div>
          </div>
          <div className="stat-box">
            <div className="num">{issuesFound}</div>
            <div className="label">Issues detected</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Crop Doctor checks</h3>
        {diagnoses.length === 0 && (
          <p className="empty-state">No checks yet. Go to the "Crop Doctor" tab and upload a photo.</p>
        )}
        {diagnoses.slice(0, 3).map((d) => (
          <div className="list-item" key={d.id}>
            <div>
              <strong>{d.result?.issueName || "—"}</strong>
              <div className="muted">{new Date(d.createdAt).toLocaleString()}</div>
            </div>
            <span className={`pill ${d.result?.isHealthy === false ? "warn" : ""}`}>
              {d.result?.isHealthy === false ? "Issue found" : "Healthy"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
