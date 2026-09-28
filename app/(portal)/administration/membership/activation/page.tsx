import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipActivationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="activation" />
    </ProtectedPortal>
  );
}
