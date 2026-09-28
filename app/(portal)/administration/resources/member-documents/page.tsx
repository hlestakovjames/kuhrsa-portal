import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesMemberDocumentsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="member-documents" />
    </ProtectedPortal>
  );
}
