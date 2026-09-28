import ProtectedPortal from "@/components/auth/ProtectedPortal";
import UsersWorkspace from "@/components/users/UsersWorkspace";

export default function AdministrationUsersPage() {
  return (
    <ProtectedPortal portal="administration">
      <UsersWorkspace />
    </ProtectedPortal>
  );
}
