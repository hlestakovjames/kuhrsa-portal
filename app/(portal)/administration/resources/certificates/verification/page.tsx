import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesCertificateVerificationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="certificate-verification" />
    </ProtectedPortal>
  );
}
