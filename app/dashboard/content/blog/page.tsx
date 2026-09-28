import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberBlogPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Blog"
      description="Explore KUHRSA insights and stories."
      memberView="content-blog"
    />
  );
}
