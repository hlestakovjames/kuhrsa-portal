import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesDocumentsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="documents" />
    </ProtectedPortal>
  );
}
