import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinancePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
