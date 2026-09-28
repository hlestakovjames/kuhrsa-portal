import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationCommunicationWorkspace from "@/components/administration/AdministrationCommunicationWorkspace";

export default function AdministrationCommunicationTemplatesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationCommunicationWorkspace view="templates" />
    </ProtectedPortal>
  );
}
