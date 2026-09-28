import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemSecurityPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="security" />
    </ProtectedPortal>
  );
}
