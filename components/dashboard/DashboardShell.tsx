"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AuthUser,
  logout,
  PortalType,
} from "@/lib/auth";

import DashboardSidebar from "./DashboardSidebar";

type DashboardShellProps = {
  portal: PortalType;
  user: AuthUser;
  children: ReactNode;
};

const titles: Record<PortalType, string> = {
  member: "Member Portal",
  executive: "Executive Portal",
  administration: "Administration Portal",
};

export default function DashboardShell({
  portal,
  user,
  children,
}: DashboardShellProps) {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F6FBFD]">
      <DashboardSidebar
        portal={portal}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() =>
          setMobileOpen(false)
        }
      />

      <div className="flex h-screen flex-col lg:pl-[290px]">
        <header className="sticky top-0 z-30 shrink-0 border-b border-black/5 bg-white/95 backdrop-blur">
          <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileOpen(true)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-[#0B2633] transition hover:bg-black/[0.03] lg:hidden"
                aria-label="Open navigation"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#168DB8]">
                  KUHRSA
                </p>

                <p className="mt-0.5 text-sm font-bold text-[#0B2633]">
                  {titles[portal]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-[#0B2633]">
                  {user.email}
                </p>

                <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                  {user.isSystemOwner
                    ? "System Owner"
                    : user.roles
                        .map(
                          (role) =>
                            role.name,
                        )
                        .join(", ")}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2633] text-xs font-black text-white">
                {user.email
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
