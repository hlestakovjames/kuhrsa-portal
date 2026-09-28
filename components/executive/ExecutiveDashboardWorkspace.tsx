"use client";

import Link from "next/link";

import { AuthUser } from "@/lib/auth";

type DashboardResponse = {
  portal: "executive" | "administration" | "member";
  message: string;
  user: {
    id: string;
    email: string;
    member?: AuthUser["member"];
    roles?: string[];
    isSystemOwner?: boolean;
  };
};

type ExecutiveDashboardWorkspaceProps = {
  user: AuthUser;
  dashboard: DashboardResponse;
};

type WorkspaceCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

function getRoleLabels(user: AuthUser) {
  if (user.isSystemOwner) {
    return ["System Owner"];
  }

  return user.roles
    .map((role) => role.name)
    .filter(Boolean);
}

function getMemberName(user: AuthUser) {
  const member = user.member;

  if (!member) {
    return "KUHRSA Executive";
  }

  const candidate = member as typeof member & {
    firstName?: string;
    lastName?: string;
    name?: string;
    fullName?: string;
  };

  if (candidate.fullName) {
    return candidate.fullName;
  }

  if (candidate.name) {
    return candidate.name;
  }

  if (candidate.firstName || candidate.lastName) {
    return [candidate.firstName, candidate.lastName]
      .filter(Boolean)
      .join(" ");
  }

  return member.memberNumber || "KUHRSA Executive";
}

function WorkspaceIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#168DB8]/10 text-[#168DB8]">
      {children}
    </div>
  );
}

function WorkspaceCard({
  eyebrow,
  title,
  description,
  href,
  icon,
}: WorkspaceCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <WorkspaceIcon>{icon}</WorkspaceIcon>

        <span className="text-lg font-semibold text-[#168DB8] transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
        {eyebrow}
      </p>

      <h3 className="mt-1.5 text-lg font-black tracking-tight text-[#0B2633]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/50">
        {description}
      </p>
    </Link>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.35rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>

      <p className="mt-1 text-xs text-black/45">
        {description}
      </p>
    </div>
  );
}

export default function ExecutiveDashboardWorkspace({
  user,
  dashboard,
}: ExecutiveDashboardWorkspaceProps) {
  const roles = getRoleLabels(user);
  const memberName = getMemberName(user);

  const primaryRole =
    roles.length > 0
      ? roles[0]
      : "Executive Member";

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-[#0B2633] shadow-[0_25px_80px_-35px_rgba(11,38,51,0.55)]">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#168DB8]/25 blur-3xl" />

        <div className="absolute -bottom-28 left-[35%] h-72 w-72 rounded-full bg-[#168DB8]/10 blur-3xl" />

        <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[#168DB8]" />

                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                  Management Dashboard
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome, {memberName}.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                {dashboard.message ||
                  "Manage your authorized KUHRSA leadership responsibilities from one central workspace."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/[0.08] px-3.5 py-2 text-xs font-bold text-white/75">
                  {primaryRole}
                </span>

                <span className="rounded-full bg-white/[0.08] px-3.5 py-2 text-xs font-bold text-white/75">
                  Executive Access
                </span>

                {user.member?.memberNumber && (
                  <span className="rounded-full bg-white/[0.08] px-3.5 py-2 text-xs font-bold text-white/75">
                    {user.member.memberNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#0B2633] transition hover:bg-white/90"
              >
                Member Dashboard
              </Link>

              <Link
                href="/executive/leadership"
                className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.1]"
              >
                My Executive Role
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two-sided workspace */}
      <section className="mt-6">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
            Your KUHRSA Access
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#0B2633]">
            Two dashboards. One account.
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-black/50">
            Your executive account remains a KUHRSA member account. You can
            move between your personal member workspace and your authorized
            management workspace without maintaining separate accounts.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#168DB8]/15 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#168DB8] text-white">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 21c.8-4 3-6 7-6s6.2 2 7 6" />
                </svg>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
                  Member Side
                </p>

                <h3 className="mt-1 text-xl font-black text-[#0B2633]">
                  My Member Dashboard
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Access your own membership, payments, events, activities,
                  elections, communication, services and account information.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#168DB8] px-5 py-3 text-sm font-black text-white transition hover:bg-[#11799D]"
            >
              Open Member Dashboard
              <span>→</span>
            </Link>
          </div>

          <div className="rounded-[1.75rem] border border-[#0B2633]/10 bg-[#0B2633] p-6 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M4 19V5" />
                  <path d="M4 5h13l-2 4 2 4H4" />
                  <path d="M8 19h12" />
                </svg>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
                  Management Side
                </p>

                <h3 className="mt-1 text-xl font-black text-white">
                  Executive Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Coordinate authorized leadership responsibilities, member
                  support, events, activities, communication and reports.
                </p>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white/75">
              Current Workspace
              <span className="h-2 w-2 rounded-full bg-[#168DB8]" />
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mt-8">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
            Executive Overview
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#0B2633]">
            Your management workspace
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Access"
            value="Active"
            description="Executive portal access"
          />

          <StatCard
            label="Membership"
            value={
              user.member?.status
                ? user.member.status
                    .toLowerCase()
                    .replace(/_/g, " ")
                : "Linked"
            }
            description="Current member account"
          />

          <StatCard
            label="Role"
            value={roles.length > 0 ? roles.length.toString() : "1"}
            description={
              roles.length === 1
                ? "Assigned access role"
                : "Assigned access roles"
            }
          />

          <StatCard
            label="Workspace"
            value="Executive"
            description="Management environment"
          />
        </div>
      </section>

      {/* Management modules */}
      <section className="mt-8">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
            Management Modules
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#0B2633]">
            Executive workspaces
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-black/50">
            These are the major management areas. The exact actions available
            inside each area will eventually be controlled by your assigned
            position, role, permissions and scope.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <WorkspaceCard
            eyebrow="Leadership"
            title="My Office"
            description="View your executive role, appointment, term and assigned committees."
            href="/executive/leadership"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="7" r="3" />
                <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
              </svg>
            }
          />

          <WorkspaceCard
            eyebrow="Members"
            title="Member Management"
            description="Perform authorized member lookup, verification and support tasks."
            href="/executive/members/lookup"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20c.7-3.5 2.5-5.5 5.5-5.5s4.8 2 5.5 5.5" />
                <path d="M16 5.5a3 3 0 0 1 0 5.5" />
                <path d="M17 14.5c1.9.6 3.1 2.3 3.5 4.5" />
              </svg>
            }
          />

          <WorkspaceCard
            eyebrow="Events"
            title="Events"
            description="Coordinate authorized event registration, attendance and event operations."
            href="/executive/events"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 3v4M17 3v4M3 10h18" />
                <path d="M8 14h3M8 17h3M14 14h3" />
              </svg>
            }
          />

          <WorkspaceCard
            eyebrow="Activities"
            title="Activities"
            description="Manage and monitor association activities and participation."
            href="/executive/activities"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 17.5 9 12l3 3 8-9" />
                <path d="M16 6h4v4" />
                <path d="M4 21h16" />
              </svg>
            }
          />

          <WorkspaceCard
            eyebrow="Attendance"
            title="Attendance"
            description="Access authorized attendance sessions, scanning and attendance records."
            href="/executive/attendance"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m5 12 4 4L19 6" />
                <rect x="3" y="3" width="18" height="18" rx="3" />
              </svg>
            }
          />

          <WorkspaceCard
            eyebrow="Communication"
            title="Communication"
            description="View authorized announcements and executive notifications."
            href="/executive/communication/notifications"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 5h16v11H8l-4 4z" />
                <path d="M8 9h8M8 12h5" />
              </svg>
            }
          />

          <WorkspaceCard
            eyebrow="Reports"
            title="Reports"
            description="Review reports available to your executive role and scope."
            href="/executive/reports"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
            }
          />

          <WorkspaceCard
            eyebrow="Account"
            title="My Account"
            description="Manage your executive profile, security and account settings."
            href="/executive/account/profile"
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5 21c.9-4 3.1-6 7-6s6.1 2 7 6" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Access model */}
      <section className="mt-8 rounded-[1.75rem] border border-[#168DB8]/10 bg-[#F4FAFC] p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
              Access Model
            </p>

            <h2 className="mt-2 text-xl font-black tracking-tight text-[#0B2633]">
              Position-based management is coming next
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-black/50">
              The management portal is intentionally shared across KUHRSA
              leadership. Once position configuration and permission mapping
              are connected, your dashboard will automatically expose the
              functions assigned to your office without creating a separate
              portal for every position.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/35">
              Current Access
            </p>

            <p className="mt-1 text-sm font-black text-[#0B2633]">
              {primaryRole}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
