import os

with open('loan-calculator/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

table_css = """
/* ===== DEDUCTION TABLE ===== */
.deduction-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  font-size: 0.95rem;
}

.deduction-table th {
  text-align: left;
  padding: 12px 16px;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-weight: 700;
  border-bottom: 2px solid var(--border);
  border-radius: 8px 8px 0 0;
}

.deduction-table th:last-child {
  text-align: right;
}

.deduction-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  font-weight: 500;
  vertical-align: middle;
}

.deduction-table td:last-child {
  text-align: right;
  font-weight: 700;
}

.deduction-table tr.deduction-total td {
  border-top: 2px solid var(--primary);
  border-bottom: none;
  padding-top: 20px;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  background: var(--primary-light);
}

.deduction-table tr.deduction-total td:first-child {
  border-radius: 0 0 0 8px;
}
.deduction-table tr.deduction-total td:last-child {
  border-radius: 0 0 8px 0;
}

.deduction-table tr:not(.deduction-total):hover td {
  background: var(--surface-2);
  transition: background 0.2s ease;
}
"""

if '.deduction-table {' not in css:
    css += "\n" + table_css

with open('loan-calculator/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Deduction table CSS successfully appended.")
