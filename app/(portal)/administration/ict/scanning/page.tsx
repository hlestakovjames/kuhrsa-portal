import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTScanningPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="scanning" />
    </ProtectedPortal>
  );
}
