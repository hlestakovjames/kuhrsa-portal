import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationCommunicationWorkspace from "@/components/administration/AdministrationCommunicationWorkspace";

export default function AdministrationCommunicationSmsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationCommunicationWorkspace view="sms" />
    </ProtectedPortal>
  );
}
