import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipHistoryPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="history" />
    </ProtectedPortal>
  );
}
