// Simple localStorage-backed data layer.
// Everything lives on the farmer's own device — no account, no server DB,
// no cost to run at scale. Good enough for a personal farm diary.

const KEYS = {
  fields: "fasaldost_fields",
  expenses: "fasaldost_expenses",
  diagnoses: "fasaldost_diagnoses",
};

function read(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---- Fields ----
export function getFields() {
  return read(KEYS.fields);
}
export function addField(field) {
  const fields = getFields();
  const newField = { id: uid(), createdAt: new Date().toISOString(), ...field };
  write(KEYS.fields, [newField, ...fields]);
  return newField;
}
export function deleteField(id) {
  write(
    KEYS.fields,
    getFields().filter((f) => f.id !== id)
  );
}

// ---- Expenses ----
export function getExpenses() {
  return read(KEYS.expenses);
}
export function addExpense(expense) {
  const expenses = getExpenses();
  const newExpense = { id: uid(), createdAt: new Date().toISOString(), ...expense };
  write(KEYS.expenses, [newExpense, ...expenses]);
  return newExpense;
}
export function deleteExpense(id) {
  write(
    KEYS.expenses,
    getExpenses().filter((e) => e.id !== id)
  );
}

// ---- Diagnoses (Crop Doctor history) ----
export function getDiagnoses() {
  return read(KEYS.diagnoses);
}
export function addDiagnosis(diagnosis) {
  const diagnoses = getDiagnoses();
  const newDiagnosis = { id: uid(), createdAt: new Date().toISOString(), ...diagnosis };
  // Keep only the 20 most recent to avoid bloating localStorage with images.
  write(KEYS.diagnoses, [newDiagnosis, ...diagnoses].slice(0, 20));
  return newDiagnosis;
}
export function deleteDiagnosis(id) {
  write(
    KEYS.diagnoses,
    getDiagnoses().filter((d) => d.id !== id)
  );
}
