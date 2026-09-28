import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationRolesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="roles" />
    </ProtectedPortal>
  );
}
