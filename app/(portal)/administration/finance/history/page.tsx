import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceHistoryPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="history" />
    </ProtectedPortal>
  );
}
