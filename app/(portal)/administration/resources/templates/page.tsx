import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesTemplatesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="templates" />
    </ProtectedPortal>
  );
}
