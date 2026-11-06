"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RoleManagementWorkspace from "@/components/administration/RoleManagementWorkspace";
import UsersWorkspace from "@/components/users/UsersWorkspace";
import { getToken } from "@/lib/auth";

type AccessView =
  | "users"
  | "roles"
  | "permissions"
  | "positions"
  | "rules"
  | "delegated"
  | "reviews"
  | "logs";

type Props = {
  view: AccessView;
};

const assignments = [
  ["Chairperson", "Executive Committee", "Current Term", "Assigned"],
  ["Treasurer", "Finance Committee", "Current Term", "Assigned"],
  ["Secretary General", "Executive Committee", "Current Term", "Assigned"],
  ["Publicity Secretary", "Communications Committee", "Current Term", "Assigned"],
  ["Organizing Secretary", "Programs & Activities", "Current Term", "Assigned"],
  ["ICT Manager", "ICT & Systems", "Current Term", "Assigned"],
];

const accessRules = [
  ["Executive Portal", "Executive appointment required", "Enabled"],
  ["Administration Portal", "Administrative role required", "Enabled"],
  ["Finance", "Finance permission required", "Enabled"],
  ["Member Verification", "Verification permission required", "Enabled"],
  ["System Administration", "Super Administrator / System Owner", "Enabled"],
];

const delegated = [
  ["Treasurer", "Deputy Treasurer", "Finance oversight", "Active"],
  ["Secretary General", "Deputy Secretary General", "Secretariat", "Active"],
  ["Publicity Secretary", "Deputy Publicity Secretary", "Communications", "Active"],
  ["Organizing Secretary", "Deputy Organizing Secretary", "Events", "Scheduled"],
];

const reviews = [
  ["Jordan Otieno", "Executive - Treasurer", "06 Sep 2026", "Approved"],
  ["Taylor Wambui", "Executive - Secretary General", "05 Sep 2026", "Pending"],
  ["Casey Kariuki", "Content Administrator", "01 Sep 2026", "Approved"],
];

const logs = [
  ["08 Sep 2026", "Avery Morgan", "Updated role permissions", "Access"],
  ["08 Sep 2026", "Jordan Otieno", "Viewed finance records", "Finance"],
  ["07 Sep 2026", "Taylor Wambui", "Accessed governance records", "Governance"],
  ["06 Sep 2026", "Casey Kariuki", "Published announcement", "Content"],
];

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#CE26A4]">
        User & Access Management
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633]">
        {title}
      </h1>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">
        {description}
      </p>
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  const positive =
    value === "Active" ||
    value === "Assigned" ||
    value === "Enabled" ||
    value === "Approved";

  const attention =
    value === "Pending" ||
    value === "Scheduled" ||
    value === "Restricted" ||
    value === "Term / Assigned" ||
    value === "Appointment";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : attention
            ? "bg-[#CE26A4]/10 text-[#CE26A4]"
            : "bg-black/[0.05] text-black/50"
      }`}
    >
      {value}
    </span>
  );
}

const ACCESS_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ??
  "http://localhost:3001";

type AccessSummary = {
  users: number | null;
  roles: number | null;
  permissions: number | null;
  activeRoleAssignments: number | null;
};

function DashboardView() {
  const [summary, setSummary] = useState<AccessSummary>({
    users: null,
    roles: null,
    permissions: null,
    activeRoleAssignments: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      const token = getToken();
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      const requestList = async (path: string) => {
        try {
          const response = await fetch(`${ACCESS_API_URL}${path}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });
          if (!response.ok) return null;
          const data: unknown = await response.json().catch(() => null);
          return Array.isArray(data) ? data : null;
        } catch {
          return null;
        }
      };

      const [users, roles, permissions] = await Promise.all([
        requestList("/users"),
        requestList("/roles"),
        requestList("/permissions"),
      ]);

      if (!mounted) return;

      const roleRecords = roles as Array<{ userCount?: number }> | null;
      setSummary({
        users: users?.length ?? null,
        roles: roles?.length ?? null,
        permissions: permissions?.length ?? null,
        activeRoleAssignments: roleRecords
          ? roleRecords.reduce((total, role) => total + (Number(role.userCount) || 0), 0)
          : null,
      });
      setLoading(false);
    }

    void loadSummary();
    return () => {
      mounted = false;
    };
  }, []);

  const displayCount = (value: number | null) =>
    loading ? "…" : value === null ? "Unavailable" : value.toLocaleString("en-KE");

  return (
    <div className="space-y-6">
      <Header
        title="User & Access Management"
        description="Live organization-scoped user, role and permission totals from the KUHRSA backend. Access to each dataset follows the permissions assigned to your account."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="System Users" value={displayCount(summary.users)} />
        <StatCard label="Configured Roles" value={displayCount(summary.roles)} />
        <StatCard label="Permissions" value={displayCount(summary.permissions)} />
        <StatCard label="Active Role Assignments" value={displayCount(summary.activeRoleAssignments)} />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">Access Management</h2>
        <p className="mt-1 text-sm text-black/45">
          Open the live management screens. Protected system roles and permissions remain read-only; custom role grants are validated by the backend.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ["Users", "/administration/users"],
            ["Roles", "/administration/access/roles"],
            ["Permissions", "/administration/access/permissions"],
            ["Position Assignments", "/administration/access/positions"],
            ["Access Rules", "/administration/access/rules"],
            ["Delegated Access", "/administration/access/delegated"],
            ["Access Reviews", "/administration/access/reviews"],
            ["Access Logs", "/administration/access/logs"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl bg-[#F8FBFC] p-4 text-sm font-bold text-[#0B2633] transition hover:bg-[#FFF7FC]"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function UsersView() {
  return <UsersWorkspace />;
}

function RolesView() {
  return <RoleManagementWorkspace view="roles" />;
}

function PermissionsView() {
  return <RoleManagementWorkspace view="permissions" />;
}

function PositionAssignmentsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Position Assignments"
        description="Assign users to KUHRSA executive positions and governance responsibilities."
      />

      <section className="space-y-3">
        {assignments.map(([position, committee, term, status]) => (
          <div
            key={position}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {position}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {committee} • {term}
                </p>
              </div>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>

      <div className="rounded-2xl border border-[#CE26A4]/10 bg-[#FFF7FC] p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#CE26A4]">
          Executive Architecture
        </p>

        <p className="mt-2 text-sm leading-6 text-black/55">
          Position assignment identifies the office bearer. Roles and
          permissions determine what that office bearer can access and do.
        </p>
      </div>
    </div>
  );
}

function RulesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Access Rules"
        description="Define conditions that determine portal and module access."
      />

      <section className="space-y-3">
        {accessRules.map(([resource, rule, status]) => (
          <div
            key={resource}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {resource}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {rule}
                </p>
              </div>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function DelegatedView() {
  return (
    <div className="space-y-6">
      <Header
        title="Delegated Access"
        description="Manage temporary or scoped authority delegated between authorized users."
      />

      <section className="space-y-3">
        {delegated.map(([from, to, scope, status]) => (
          <div
            key={`${from}-${to}`}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {from} → {to}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Delegated scope: {scope}
                </p>
              </div>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ReviewsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Access Reviews"
        description="Periodic review of user roles, permissions and access assignments."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Reviews Due" value="7" />
        <StatCard label="Approved" value="18" />
        <StatCard label="Escalated" value="2" />
      </section>

      <section className="space-y-3">
        {reviews.map(([user, role, date, status]) => (
          <div
            key={user}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {user}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {role} • Review date {date}
                </p>
              </div>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function LogsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Access Logs"
        description="Auditable records of authentication, access and authorization activity."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["Date", "User", "Action", "Area"].map((item) => (
                  <th
                    key={item}
                    className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {logs.map(([date, user, action, area]) => (
                <tr
                  key={`${date}-${user}-${action}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-xs text-black/50 first:pl-0">
                    {date}
                  </td>

                  <td className="px-3 py-4 text-sm font-black text-[#0B2633]">
                    {user}
                  </td>

                  <td className="px-3 py-4 text-xs text-black/55">
                    {action}
                  </td>

                  <td className="px-3 py-4 text-xs font-semibold text-black/50">
                    {area}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function AdministrationAccessWorkspace({
  view,
}: Props) {
  switch (view) {
    case "users":
      return <UsersView />;

    case "roles":
      return <RolesView />;

    case "permissions":
      return <PermissionsView />;

    case "positions":
      return <PositionAssignmentsView />;

    case "rules":
      return <RulesView />;

    case "delegated":
      return <DelegatedView />;

    case "reviews":
      return <ReviewsView />;

    case "logs":
      return <LogsView />;

    default:
      return <DashboardView />;
  }
}
