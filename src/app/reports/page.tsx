import Protected from "../components/Protected";
import ReportsPage from "./ReportList"; // move your current reports list into ReportsContent.tsx

export default function ReportsWrapper() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <Protected>
        <ReportsPage />
      </Protected>
    </main>
  );
}
