import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationCommunicationWorkspace from "@/components/administration/AdministrationCommunicationWorkspace";

export default function AdministrationCommunicationHistoryPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationCommunicationWorkspace view="history" />
    </ProtectedPortal>
  );
}
