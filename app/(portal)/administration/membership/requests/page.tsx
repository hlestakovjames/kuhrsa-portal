import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipRequestsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="requests" />
    </ProtectedPortal>
  );
}
