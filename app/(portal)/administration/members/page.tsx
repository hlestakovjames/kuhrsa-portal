import ProtectedPortal from "@/components/auth/ProtectedPortal";
import MembersWorkspace from "@/components/members/MembersWorkspace";

export default function AdministrationMembersPage() {
  return (
    <ProtectedPortal portal="administration">
      <MembersWorkspace />
    </ProtectedPortal>
  );
}