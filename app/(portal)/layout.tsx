import type { ReactNode } from "react";

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4FAFC] text-[#0B2633]">
      {children}
    </div>
  );
}