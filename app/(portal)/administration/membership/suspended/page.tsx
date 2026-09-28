import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipSuspendedPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="suspended" />
    </ProtectedPortal>
  );
}
