import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ReceiptsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Receipts"
      description="View your KUHRSA payment receipts."
      memberView="finance-receipts"
    />
  );
}
