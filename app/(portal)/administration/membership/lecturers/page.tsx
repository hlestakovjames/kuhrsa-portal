import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipLecturersPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="lecturers" />
    </ProtectedPortal>
  );
}
