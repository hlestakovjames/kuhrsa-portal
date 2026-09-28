import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function PaymentHistoryPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Payment History"
      description="Review your KUHRSA payment history."
      memberView="finance-history"
    />
  );
}
