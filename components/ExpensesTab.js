"use client";

import { useState } from "react";

const CATEGORIES = ["Seed", "Fertilizer", "Pesticide", "Labor", "Water/Irrigation", "Equipment", "Other"];

export default function ExpensesTab({ fields, expenses, onAdd, onDelete }) {
  const [fieldId, setFieldId] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    onAdd({ fieldId, category, amount, date, note });
    setAmount("");
    setNote("");
  }

  const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  function fieldName(id) {
    return fields.find((f) => f.id === id)?.name || "General";
  }

  return (
    <div>
      <div className="card">
        <h2>Add expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-row">
              <label>Field</label>
              <select value={fieldId} onChange={(e) => setFieldId(e.target.value)}>
                <option value="">General (no specific field)</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Amount (Rs)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 2500" />
            </div>
            <div className="form-row">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <label>Note (optional)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Urea for north plot" />
          </div>
          <button className="btn" type="submit">Add expense</button>
        </form>
      </div>

      <div className="card">
        <h2>Expenses — total Rs {total.toLocaleString()}</h2>
        {expenses.length === 0 && <p className="empty-state">No expenses logged yet.</p>}
        {expenses.map((e) => (
          <div className="list-item" key={e.id}>
            <div>
              <strong>{e.category}</strong> — Rs {parseFloat(e.amount).toLocaleString()}
              <div className="muted">
                {fieldName(e.fieldId)} {e.date ? `· ${e.date}` : ""} {e.note ? `· ${e.note}` : ""}
              </div>
            </div>
            <button className="btn danger" onClick={() => onDelete(e.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
