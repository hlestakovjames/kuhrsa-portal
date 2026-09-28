import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceExpensesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="expenses" />
    </ProtectedPortal>
  );
}
