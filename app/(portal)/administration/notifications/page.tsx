import ProtectedPortal from "@/components/auth/ProtectedPortal";
import NotificationsWorkspace from "@/components/notifications/NotificationsWorkspace";

export default function AdministrationNotificationsPage() {
  return (
    <ProtectedPortal portal="administration">
      <NotificationsWorkspace />
    </ProtectedPortal>
  );
}