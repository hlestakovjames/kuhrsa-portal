import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberNewsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="News"
      description="Read KUHRSA news and updates."
      memberView="content-news"
    />
  );
}
