import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
