import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTQRPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="qr" />
    </ProtectedPortal>
  );
}
