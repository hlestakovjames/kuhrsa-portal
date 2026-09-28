import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipStudentsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="students" />
    </ProtectedPortal>
  );
}
