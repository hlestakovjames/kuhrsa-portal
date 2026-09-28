import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationPermissionsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="permissions" />
    </ProtectedPortal>
  );
}
