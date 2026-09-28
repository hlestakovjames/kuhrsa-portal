"use client";

import Link from "next/link";

type SystemView =
  | "dashboard"
  | "super-administrators"
  | "administrators"
  | "configuration"
  | "security"
  | "database"
  | "maintenance"
  | "audit"
  | "settings"
  | "health";

type Props = {
  view: SystemView;
};

const superAdministrators = [
  {
    name: "System Owner",
    email: "owner@example.test",
    scope: "Permanent",
    status: "Active",
  },
  {
    name: "Super Administrator A",
    email: "admin-a@example.test",
    scope: "Full Administration",
    status: "Active",
  },
  {
    name: "Super Administrator B",
    email: "admin-b@example.test",
    scope: "Full Administration",
    status: "Active",
  },
];

const administrators = [
  {
    name: "Avery Morgan",
    role: "Membership Administrator",
    scope: "Membership",
    status: "Active",
  },
  {
    name: "Casey Kariuki",
    role: "Content Administrator",
    scope: "Content & Publicity",
    status: "Active",
  },
  {
    name: "Jordan Otieno",
    role: "Finance Administrator",
    scope: "Finance",
    status: "Active",
  },
  {
    name: "Taylor Wambui",
    role: "Secretariat Administrator",
    scope: "Secretariat",
    status: "Active",
  },
];

const configurations = [
  ["Membership Cycle", "September → August"],
  ["Registration Fee", "KSh 250"],
  ["Annual Membership Fee", "KSh 200"],
  ["Minimum Installment", "KSh 50"],
  ["Maximum Super Administrators", "3"],
  ["Maximum Administrators", "10"],
  ["Default Member Role", "Member"],
  ["Audit Logging", "Enabled"],
];

const securityItems = [
  ["Authentication", "Central KUHRSA authentication", "Healthy"],
  ["Password Policy", "Configured", "Healthy"],
  ["Role Enforcement", "Permission-based", "Healthy"],
  ["Audit Logging", "Enabled", "Healthy"],
  ["Session Monitoring", "Enabled", "Healthy"],
  ["Security Alerts", "Monitored", "Review"],
];

const databaseItems = [
  ["Database Engine", "PostgreSQL", "Connected"],
  ["Schema Status", "Current", "Healthy"],
  ["Recent Backup", "08 Sep 2026", "Successful"],
  ["Connection Pool", "Operational", "Healthy"],
  ["Migration Status", "Up to date", "Healthy"],
];

const maintenanceItems = [
  ["Database maintenance", "Scheduled", "12 Sep 2026"],
  ["Application cache review", "Planned", "13 Sep 2026"],
  ["Log rotation", "Scheduled", "14 Sep 2026"],
  ["System health review", "Planned", "15 Sep 2026"],
];

const auditItems = [
  ["Avery Morgan", "Updated system configuration", "08 Sep 2026 14:31"],
  ["Jordan Otieno", "Reviewed finance permissions", "08 Sep 2026 12:08"],
  ["Taylor Wambui", "Viewed governance records", "07 Sep 2026 17:44"],
  ["Casey Kariuki", "Published content", "07 Sep 2026 15:26"],
];

const healthItems = [
  ["Frontend Application", "Operational", "99.9%"],
  ["API Service", "Operational", "99.8%"],
  ["Database", "Operational", "99.9%"],
  ["Authentication", "Operational", "99.9%"],
  ["Email Integration", "Operational", "99.5%"],
  ["SMS Integration", "Configured", "Review"],
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
        System Administration
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
    value === "Healthy" ||
    value === "Operational" ||
    value === "Successful" ||
    value === "Connected" ||
    value === "Enabled";

  const attention =
    value === "Review" ||
    value === "Configured" ||
    value === "Scheduled" ||
    value === "Planned";

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

function DashboardView() {
  return (
    <div className="space-y-6">
      <Header
        title="System Dashboard"
        description="High-level system administration for privileged accounts, configuration, security, database, maintenance, audit and system health."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Super Administrators" value="3" />
        <StatCard label="Administrators" value="10" />
        <StatCard label="System Health" value="99.8%" />
        <StatCard label="Audit Events Today" value="42" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            System Health
          </h2>

          <div className="mt-5 space-y-3">
            {healthItems.map(([name, status, value]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8FBFC] p-4"
              >
                <div>
                  <p className="text-sm font-black text-[#0B2633]">
                    {name}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {value}
                  </p>
                </div>

                <Badge value={status} />
              </div>
            ))}
          </div>

          <Link
            href="/administration/system/health"
            className="mt-5 inline-flex text-sm font-black text-[#CE26A4]"
          >
            View system health →
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Privileged Access
          </h2>

          <div className="mt-5 space-y-3">
            {superAdministrators.map((item) => (
              <div
                key={item.email}
                className="rounded-2xl bg-[#F8FBFC] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-[#0B2633]">
                    {item.name}
                  </p>

                  <Badge value={item.status} />
                </div>

                <p className="mt-1 text-xs text-black/40">
                  {item.scope}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/administration/system/super-administrators"
            className="mt-5 inline-flex text-sm font-black text-[#CE26A4]"
          >
            Manage privileged access →
          </Link>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          System Operations
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Super Administrators", "/administration/system/super-administrators"],
            ["Administrator Accounts", "/administration/system/administrators"],
            ["Configuration", "/administration/system/configuration"],
            ["Security", "/administration/system/security"],
            ["Database", "/administration/system/database"],
            ["Maintenance", "/administration/system/maintenance"],
            ["Audit Logs", "/administration/system/audit"],
            ["System Settings", "/administration/system/settings"],
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

function SuperAdministratorsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Super Administrators"
        description="Manage the highest-level KUHRSA administrative accounts."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Maximum Allowed" value="3" />
        <StatCard label="Currently Assigned" value="3" />
        <StatCard label="Available Slots" value="0" />
      </section>

      <section className="space-y-3">
        {superAdministrators.map((item) => (
          <div
            key={item.email}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.email} • {item.scope}
                </p>
              </div>

              <Badge value={item.status} />
            </div>
          </div>
        ))}
      </section>

      <div className="rounded-2xl border border-[#CE26A4]/10 bg-[#FFF7FC] p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#CE26A4]">
          Governance Control
        </p>

        <p className="mt-2 text-sm leading-6 text-black/55">
          KUHRSA supports a maximum of three Super Administrators. The System
          Owner remains a distinct permanent authority.
        </p>
      </div>
    </div>
  );
}

function AdministratorsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Administrator Accounts"
        description="Manage operational administrator accounts and their assigned scopes."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Maximum Allowed" value="10" />
        <StatCard label="Active" value="4" />
        <StatCard label="Available Slots" value="6" />
      </section>

      <section className="space-y-3">
        {administrators.map((item) => (
          <div
            key={item.name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.role} • Scope: {item.scope}
                </p>
              </div>

              <Badge value={item.status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ConfigurationView() {
  return (
    <div className="space-y-6">
      <Header
        title="System Configuration"
        description="Core KUHRSA system settings represented as synthetic configuration values."
      />

      <section className="grid gap-3 md:grid-cols-2">
        {configurations.map(([label, value]) => (
          <div
            key={label}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
              {label}
            </p>

            <p className="mt-2 text-sm font-black text-[#0B2633]">
              {value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function SecurityView() {
  return (
    <div className="space-y-6">
      <Header
        title="Security"
        description="Monitor security controls and privileged system protections."
      />

      <section className="grid gap-3 md:grid-cols-2">
        {securityItems.map(([name, detail, status]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {detail}
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

function DatabaseView() {
  return (
    <div className="space-y-6">
      <Header
        title="Database"
        description="Administrative view of database connectivity, schema and backup status."
      />

      <section className="grid gap-3 md:grid-cols-2">
        {databaseItems.map(([name, detail, status]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {detail}
                </p>
              </div>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
          Restricted Area
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          Actual database operations will be protected by backend
          authorization. This frontend is only a system-administration mock.
        </p>
      </div>
    </div>
  );
}

function MaintenanceView() {
  return (
    <div className="space-y-6">
      <Header
        title="Maintenance"
        description="Plan and monitor scheduled KUHRSA system maintenance activities."
      />

      <section className="space-y-3">
        {maintenanceItems.map(([task, status, date]) => (
          <div
            key={task}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {task}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Scheduled date: {date}
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

function AuditView() {
  return (
    <div className="space-y-6">
      <Header
        title="Audit Logs"
        description="Review auditable system administration actions."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Events Today" value="42" />
        <StatCard label="Security Events" value="3" />
        <StatCard label="Configuration Changes" value="5" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["Time", "User", "Action"].map((item) => (
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
              {auditItems.map(([user, action, date]) => (
                <tr
                  key={`${user}-${action}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-xs text-black/45 first:pl-0">
                    {date}
                  </td>

                  <td className="px-3 py-4 text-sm font-black text-[#0B2633]">
                    {user}
                  </td>

                  <td className="px-3 py-4 text-sm text-black/55">
                    {action}
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

function SettingsView() {
  return (
    <div className="space-y-6">
      <Header
        title="System Settings"
        description="Manage configurable system preferences and administrative defaults."
      />

      <section className="space-y-3">
        {[
          ["Audit Logging", "Enabled"],
          ["Session Monitoring", "Enabled"],
          ["System Notifications", "Enabled"],
          ["Maintenance Mode", "Disabled"],
          ["Automatic Backups", "Enabled"],
          ["Security Monitoring", "Enabled"],
        ].map(([name, value]) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-3xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {name}
            </p>

            <Badge value={value} />
          </div>
        ))}
      </section>
    </div>
  );
}

function HealthView() {
  return (
    <div className="space-y-6">
      <Header
        title="System Health"
        description="Detailed health status of KUHRSA platform services."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {healthItems.map(([name, status, uptime]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-black text-[#0B2633]">
                {name}
              </p>

              <Badge value={status} />
            </div>

            <p className="mt-5 text-2xl font-black tracking-tight text-[#0B2633]">
              {uptime}
            </p>

            <p className="mt-1 text-xs text-black/40">
              Synthetic availability indicator
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function AdministrationSystemWorkspace({
  view,
}: Props) {
  switch (view) {
    case "super-administrators":
      return <SuperAdministratorsView />;

    case "administrators":
      return <AdministratorsView />;

    case "configuration":
      return <ConfigurationView />;

    case "security":
      return <SecurityView />;

    case "database":
      return <DatabaseView />;

    case "maintenance":
      return <MaintenanceView />;

    case "audit":
      return <AuditView />;

    case "settings":
      return <SettingsView />;

    case "health":
      return <HealthView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
