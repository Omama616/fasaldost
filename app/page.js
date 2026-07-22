"use client";

import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import FieldsTab from "../components/FieldsTab";
import DiagnoseTab from "../components/DiagnoseTab";
import AskTab from "../components/AskTab";
import ExpensesTab from "../components/ExpensesTab";
import * as store from "../lib/storage";

const TABS = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "fields", label: "🌱 My Fields" },
  { id: "diagnose", label: "🩺 Crop Doctor" },
  { id: "ask", label: "💬 Ask AI" },
  { id: "expenses", label: "💰 Expenses" },
];

export default function Home() {
  const [tab, setTab] = useState("dashboard");
  const [fields, setFields] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    setFields(store.getFields());
    setExpenses(store.getExpenses());
    setDiagnoses(store.getDiagnoses());
  }, []);

  function handleAddField(field) {
    store.addField(field);
    setFields(store.getFields());
  }
  function handleDeleteField(id) {
    store.deleteField(id);
    setFields(store.getFields());
  }
  function handleAddExpense(expense) {
    store.addExpense(expense);
    setExpenses(store.getExpenses());
  }
  function handleDeleteExpense(id) {
    store.deleteExpense(id);
    setExpenses(store.getExpenses());
  }
  function handleSaveDiagnosis(diagnosis) {
    store.addDiagnosis(diagnosis);
    setDiagnoses(store.getDiagnoses());
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">🌾</div>
        <div>
          <h1>FasalDost</h1>
          <p>AI Crop Doctor & Farm Diary for small-holder farmers</p>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "dashboard" && <Dashboard fields={fields} expenses={expenses} diagnoses={diagnoses} />}
      {tab === "fields" && <FieldsTab fields={fields} onAdd={handleAddField} onDelete={handleDeleteField} />}
      {tab === "diagnose" && <DiagnoseTab fields={fields} diagnoses={diagnoses} onSave={handleSaveDiagnosis} />}
      {tab === "ask" && <AskTab />}
      {tab === "expenses" && (
        <ExpensesTab fields={fields} expenses={expenses} onAdd={handleAddExpense} onDelete={handleDeleteExpense} />
      )}

      <p className="muted" style={{ textAlign: "center", marginTop: 30 }}>
        Your data stays on this device. Built for small-holder farmers in Punjab, Pakistan.
      </p>
    </div>
  );
}
