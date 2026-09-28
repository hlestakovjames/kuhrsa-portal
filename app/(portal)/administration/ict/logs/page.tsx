import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTLogsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="logs" />
    </ProtectedPortal>
  );
}
