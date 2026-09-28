import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function StatementsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Statements"
      description="Review your KUHRSA finance statements."
      memberView="finance-statements"
    />
  );
}
