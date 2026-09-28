import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ElectionInformationPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Election Information"
      description="Review information about the current KUHRSA election."
      memberView="elections-information"
    />
  );
}
