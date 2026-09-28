import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ExecutiveDashboardPage() {
  return (
    <ProtectedDashboard
      portal="executive"
      title="Executive Dashboard"
      description="Access authorized executive functions, leadership information and association operations."
    />
  );
}