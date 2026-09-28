import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTBackupsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="backups" />
    </ProtectedPortal>
  );
}
