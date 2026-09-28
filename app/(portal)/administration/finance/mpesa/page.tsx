import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationFinanceWorkspace from "@/components/administration/AdministrationFinanceWorkspace";

export default function AdministrationFinanceMpesaPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationFinanceWorkspace view="mpesa" />
    </ProtectedPortal>
  );
}
