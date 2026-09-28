import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesDownloadsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="downloads" />
    </ProtectedPortal>
  );
}
