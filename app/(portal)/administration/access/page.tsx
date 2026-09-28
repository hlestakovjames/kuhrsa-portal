import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationAccessPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="users" />
    </ProtectedPortal>
  );
}
