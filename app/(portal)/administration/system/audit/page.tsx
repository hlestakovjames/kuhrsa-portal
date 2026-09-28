import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemAuditPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="audit" />
    </ProtectedPortal>
  );
}
