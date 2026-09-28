import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberAttendancePage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Attendance"
      description="Review your KUHRSA event and activity attendance."
      memberView="attendance"
    />
  );
}
