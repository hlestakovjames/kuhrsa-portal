import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceLedgerPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="ledger" />
    </ProtectedPortal>
  );
}
