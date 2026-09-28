import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipPendingPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="pending" />
    </ProtectedPortal>
  );
}
