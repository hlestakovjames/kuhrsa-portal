import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationCommunicationWorkspace from "@/components/administration/AdministrationCommunicationWorkspace";

export default function AdministrationCommunicationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationCommunicationWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
