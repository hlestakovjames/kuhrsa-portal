import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationAccessRulesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="rules" />
    </ProtectedPortal>
  );
}
