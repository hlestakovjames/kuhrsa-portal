import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceReconciliationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="reconciliation" />
    </ProtectedPortal>
  );
}
