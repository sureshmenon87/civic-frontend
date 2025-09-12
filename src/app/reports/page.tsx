import Protected from "../components/Protected";
import ReportsPage from "./ReportsContent"; // move your current reports list into ReportsContent.tsx

export default function ReportsWrapper() {
  return (
    <Protected>
      <ReportsPage />
    </Protected>
  );
}
