import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinancePaymentsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="payments" />
    </ProtectedPortal>
  );
}
