"use client";

import { useState } from "react";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // result looks like "data:image/jpeg;base64,AAAA..."
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DiagnoseTab({ fields, diagnoses, onSave }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropName, setCropName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError("");
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: file.type,
          cropName: cropName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
        onSave({ cropName, result: data });
      }
    } catch (err) {
      setError("Could not reach the AI service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>🩺 AI Crop Doctor</h2>
        <p className="muted">
          Take or upload a clear photo of the affected leaf or plant. The AI will tell you what
          might be wrong and what to do next, in English and Urdu.
        </p>

        <div className="form-row">
          <label>Crop name (optional, helps accuracy)</label>
          <input value={cropName} onChange={(e) => setCropName(e.target.value)} placeholder="e.g. Cotton" />
        </div>

        <div className="form-row">
          <label>Photo</label>
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} />
        </div>

        {previewUrl && <img src={previewUrl} alt="preview" className="image-preview" />}

        <button className="btn" onClick={handleAnalyze} disabled={!file || loading}>
          {loading && <span className="spinner" />}
          {loading ? "Analyzing..." : "Ask Crop Doctor"}
        </button>

        {error && <p style={{ color: "#b3452b", marginTop: 10 }}>{error}</p>}

        {result && (
          <div className={`diagnosis-result ${result.isHealthy === false ? "issue" : ""}`}>
            <h4>
              {result.isHealthy === false ? "⚠️ " : "✅ "}
              {result.issueName} {result.confidence ? `(${result.confidence} confidence)` : ""}
            </h4>
            <p>{result.explanationEnglish}</p>
            <p className="urdu-text">{result.explanationUrdu}</p>
            {result.treatmentSteps?.length > 0 && (
              <>
                <strong>What to do:</strong>
                <ul>
                  {result.treatmentSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </>
            )}
            {result.confidenceNote && <p className="muted">{result.confidenceNote}</p>}
          </div>
        )}
      </div>

      <div className="card">
        <h2>History</h2>
        {diagnoses.length === 0 && <p className="empty-state">Your past checks will appear here.</p>}
        {diagnoses.map((d) => (
          <div className="list-item" key={d.id}>
            <div>
              <strong>{d.result?.issueName || "—"}</strong>
              <div className="muted">
                {d.cropName ? `${d.cropName} · ` : ""}
                {new Date(d.createdAt).toLocaleString()}
              </div>
            </div>
            <span className={`pill ${d.result?.isHealthy === false ? "warn" : ""}`}>
              {d.result?.isHealthy === false ? "Issue" : "Healthy"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
