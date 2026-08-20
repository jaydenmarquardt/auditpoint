function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadJson(name: string, data: unknown): void {
  download(`${name}.json`, new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
}

export function downloadCsv<TRow extends Record<string, unknown>>(name: string, rows: TRow[]): void {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => escapeCell(row[header])).join(","));

  download(`${name}.csv`, new Blob([[headers.join(","), ...body].join("\n")], { type: "text/csv" }));
}

/**
 * A counts block above the rows, so the sheet opens on the same figures the tool
 * shows rather than needing a pivot to get them.
 */
export function downloadCsvWithSummary<TRow extends Record<string, unknown>>(
  name: string,
  summary: [string, string | number][],
  rows: TRow[]
): void {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => escapeCell(row[header])).join(","));
  const block = ["Measure,Count", ...summary.map(([label, value]) => `${escapeCell(label)},${escapeCell(value)}`)];

  download(
    `${name}.csv`,
    new Blob([[...block, "", headers.join(","), ...body].join("\n")], { type: "text/csv" })
  );
}

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
