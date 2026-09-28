import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
