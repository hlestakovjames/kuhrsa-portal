import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function EventHistoryPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Event History"
      description="Review your past KUHRSA participation."
      memberView="history"
    />
  );
}
