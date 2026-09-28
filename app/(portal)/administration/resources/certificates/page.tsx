import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesCertificatesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="certificates" />
    </ProtectedPortal>
  );
}
