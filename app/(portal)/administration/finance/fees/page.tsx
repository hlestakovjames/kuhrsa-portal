import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceFeesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="fees" />
    </ProtectedPortal>
  );
}
