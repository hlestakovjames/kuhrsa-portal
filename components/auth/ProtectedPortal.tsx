"use client";

import { ReactNode } from "react";
import { canAccessPortal, PortalType } from "@/lib/auth";
import { usePortalSession } from "@/components/auth/PortalSessionProvider";

type ProtectedPortalProps = {
  portal: PortalType;
  children: ReactNode;
};

export default function ProtectedPortal({ portal, children }: ProtectedPortalProps) {
  const { user } = usePortalSession();

  if (!user || !canAccessPortal(user, portal)) return null;

  return <>{children}</>;
}
