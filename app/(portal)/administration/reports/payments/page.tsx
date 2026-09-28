import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationReportsWorkspace from "@/components/administration/AdministrationReportsWorkspace";

export default function AdministrationPaymentReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationReportsWorkspace view="payments" />
    </ProtectedPortal>
  );
}
