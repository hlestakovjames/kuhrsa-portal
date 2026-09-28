import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipCardsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="cards" />
    </ProtectedPortal>
  );
}
