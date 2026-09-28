import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceReceiptsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="receipts" />
    </ProtectedPortal>
  );
}
