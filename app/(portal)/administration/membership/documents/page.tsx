import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipDocumentsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="documents" />
    </ProtectedPortal>
  );
}
