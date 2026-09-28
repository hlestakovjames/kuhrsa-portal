import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationReportsWorkspace from "@/components/administration/AdministrationReportsWorkspace";

export default function AdministrationActivityReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationReportsWorkspace view="activities" />
    </ProtectedPortal>
  );
}
