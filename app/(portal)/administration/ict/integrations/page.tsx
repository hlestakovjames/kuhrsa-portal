import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTIntegrationsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="integrations" />
    </ProtectedPortal>
  );
}
