export default function EvidencePage() {
  return (
    <div className="card">
      <h1 className="text-2xl font-bold">Evidence Center</h1>
      <p className="mt-2 text-slate-600">
        Evidence organized by purpose — attendance, photos, surveys, approvals. Every upload shows where it belongs and
        what it supports.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {["Attendance", "Photos", "Survey Results", "Financial Records", "Approvals", "Meeting Notes"].map((type) => (
          <li key={type} className="rounded border border-slate-200 px-3 py-2 text-sm">
            {type}
          </li>
        ))}
      </ul>
    </div>
  );
}
