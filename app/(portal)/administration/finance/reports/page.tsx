import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="reports" />
    </ProtectedPortal>
  );
}
