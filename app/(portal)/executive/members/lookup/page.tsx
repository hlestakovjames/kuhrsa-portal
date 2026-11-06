import ProtectedPortal from "@/components/auth/ProtectedPortal";
import ExecutiveMembersWorkspace from "@/components/executive/ExecutiveMembersWorkspace";

export default function ExecutiveMemberLookupPage() {
  return (
    <ProtectedPortal portal="executive">
      <ExecutiveMembersWorkspace />
    </ProtectedPortal>
  );
}
