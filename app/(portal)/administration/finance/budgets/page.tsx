import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceBudgetsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="budgets" />
    </ProtectedPortal>
  );
}
