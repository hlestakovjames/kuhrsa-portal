import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MakePaymentPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Make Payment"
      description="Make a KUHRSA membership payment."
      memberView="finance-payment"
    />
  );
}
