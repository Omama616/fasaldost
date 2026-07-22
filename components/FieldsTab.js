"use client";

import { useState } from "react";

export default function FieldsTab({ fields, onAdd, onDelete }) {
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [sowDate, setSowDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !crop.trim()) return;
    onAdd({ name, crop, area, sowDate });
    setName("");
    setCrop("");
    setArea("");
    setSowDate("");
  }

  return (
    <div>
      <div className="card">
        <h2>Add a field</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-row">
              <label>Field name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. North Plot" />
            </div>
            <div className="form-row">
              <label>Crop</label>
              <input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g. Wheat, Cotton" />
            </div>
            <div className="form-row">
              <label>Area (acres)</label>
              <input type="number" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 5" />
            </div>
            <div className="form-row">
              <label>Sowing date</label>
              <input type="date" value={sowDate} onChange={(e) => setSowDate(e.target.value)} />
            </div>
          </div>
          <button className="btn" type="submit">Add field</button>
        </form>
      </div>

      <div className="card">
        <h2>My fields</h2>
        {fields.length === 0 && <p className="empty-state">No fields yet. Add your first field above.</p>}
        {fields.map((f) => (
          <div className="list-item" key={f.id}>
            <div>
              <strong>{f.name}</strong>
              <div className="muted">
                {f.crop} · {f.area || "?"} acres {f.sowDate ? `· sown ${f.sowDate}` : ""}
              </div>
            </div>
            <button className="btn danger" onClick={() => onDelete(f.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
