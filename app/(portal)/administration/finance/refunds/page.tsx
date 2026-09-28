import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceRefundsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="refunds" />
    </ProtectedPortal>
  );
}
