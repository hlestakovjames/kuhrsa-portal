import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTQRVerificationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="qr-verification" />
    </ProtectedPortal>
  );
}
