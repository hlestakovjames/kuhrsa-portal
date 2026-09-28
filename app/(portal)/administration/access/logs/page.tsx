import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationAccessLogsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="logs" />
    </ProtectedPortal>
  );
}
