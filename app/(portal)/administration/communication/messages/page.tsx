import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationCommunicationWorkspace from "@/components/administration/AdministrationCommunicationWorkspace";

export default function AdministrationCommunicationMessagesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationCommunicationWorkspace view="messages" />
    </ProtectedPortal>
  );
}
