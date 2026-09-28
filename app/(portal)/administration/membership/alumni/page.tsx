import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipAlumniPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="alumni" />
    </ProtectedPortal>
  );
}
