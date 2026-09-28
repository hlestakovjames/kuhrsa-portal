import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberAnnouncementsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Announcements"
      description="Read current KUHRSA announcements."
      memberView="content-announcements"
    />
  );
}
