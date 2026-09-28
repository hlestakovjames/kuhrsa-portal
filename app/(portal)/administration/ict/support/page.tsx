import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTSupportPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="support" />
    </ProtectedPortal>
  );
}
