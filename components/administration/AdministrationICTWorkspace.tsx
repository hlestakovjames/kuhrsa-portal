"use client";

import Link from "next/link";

type ICTView =
  | "dashboard"
  | "website"
  | "support"
  | "scanning"
  | "qr"
  | "qr-verification"
  | "integrations"
  | "health"
  | "backups"
  | "logs";

type Props = {
  view: ICTView;
};

const systems = [
  ["Frontend", "Operational", "Healthy"],
  ["API", "Operational", "Healthy"],
  ["Database", "Operational", "Healthy"],
  ["Authentication", "Operational", "Healthy"],
  ["Email Service", "Connected", "Healthy"],
  ["SMS Service", "Configured", "Review"],
];

const supportTickets = [
  {
    title: "Member portal access issue",
    requester: "Synthetic Member",
    priority: "Normal",
    status: "Open",
  },
  {
    title: "QR scanner setup",
    requester: "Events Office",
    priority: "High",
    status: "In Progress",
  },
  {
    title: "Website content display",
    requester: "Publicity Office",
    priority: "Normal",
    status: "Resolved",
  },
];

const integrations = [
  ["Authentication API", "Core API", "Connected"],
  ["Database", "PostgreSQL", "Connected"],
  ["Email", "Resend", "Configured"],
  ["M-Pesa", "Daraja", "Pending Integration"],
  ["SMS", "SMS Provider", "Pending Integration"],
];

const backups = [
  ["Daily Database Backup", "08 Sep 2026 02:00", "Successful"],
  ["Application Configuration", "08 Sep 2026 02:15", "Successful"],
  ["Media Metadata", "07 Sep 2026 23:00", "Successful"],
  ["Weekly Full Backup", "06 Sep 2026 02:30", "Successful"],
];

const technicalLogs = [
  ["08 Sep 2026 14:22", "API health check completed", "System"],
  ["08 Sep 2026 13:41", "QR verification endpoint checked", "QR"],
  ["08 Sep 2026 11:08", "Backup completed successfully", "Backup"],
  ["07 Sep 2026 18:35", "Email provider connection verified", "Integration"],
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
        ICT & System Services
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
    value === "Healthy" ||
    value === "Connected" ||
    value === "Operational" ||
    value === "Successful" ||
    value === "Resolved";

  const attention =
    value === "Review" ||
    value === "Pending Integration" ||
    value === "Open" ||
    value === "In Progress" ||
    value === "High";

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
        title="ICT Dashboard"
        description="Technical oversight of KUHRSA website services, authentication, QR systems, integrations, system health, backups and technical support."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Systems Monitored" value="6" />
        <StatCard label="Healthy Systems" value="5" />
        <StatCard label="Open Support Tickets" value="2" />
        <StatCard label="Latest Backup" value="02:00" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[#0B2633]">
                System Status
              </h2>

              <p className="mt-1 text-sm text-black/40">
                Synthetic infrastructure monitoring.
              </p>
            </div>

            <Link
              href="/administration/ict/health"
              className="text-sm font-black text-[#CE26A4]"
            >
              View health →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {systems.map(([name, status, health]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8FBFC] p-4"
              >
                <div>
                  <p className="text-sm font-black text-[#0B2633]">
                    {name}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {status}
                  </p>
                </div>

                <Badge value={health} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Technical Operations
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Website", "/administration/ict/website"],
              ["Support", "/administration/ict/support"],
              ["Scanning", "/administration/ict/scanning"],
              ["QR Management", "/administration/ict/qr"],
              ["QR Verification", "/administration/ict/qr-verification"],
              ["Integrations", "/administration/ict/integrations"],
              ["Backups", "/administration/ict/backups"],
              ["Technical Logs", "/administration/ict/logs"],
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
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[#0B2633]">
              Support Queue
            </h2>

            <p className="mt-1 text-sm text-black/40">
              Current synthetic technical support records.
            </p>
          </div>

          <Link
            href="/administration/ict/support"
            className="text-sm font-black text-[#CE26A4]"
          >
            View queue →
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {supportTickets.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-[#F8FBFC] p-4"
            >
              <p className="text-sm font-black text-[#0B2633]">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-black/40">
                {item.requester} • {item.priority}
              </p>

              <div className="mt-3">
                <Badge value={item.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function WebsiteView() {
  return (
    <div className="space-y-6">
      <Header
        title="Website Management"
        description="Monitor KUHRSA public website configuration and technical publishing services."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Frontend Status" value="Healthy" />
        <StatCard label="API Status" value="Healthy" />
        <StatCard label="Published Pages" value="86" />
        <StatCard label="Media Assets" value="342" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["Frontend Application", "Next.js application", "Healthy"],
          ["API Service", "NestJS API", "Healthy"],
          ["Authentication", "KUHRSA authentication service", "Healthy"],
          ["Media Storage", "Application media repository", "Healthy"],
        ].map(([name, detail, status]) => (
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

function SupportView() {
  return (
    <div className="space-y-6">
      <Header
        title="Technical Support"
        description="Track technical support requests and system issues."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open" value="2" />
        <StatCard label="In Progress" value="1" />
        <StatCard label="Resolved" value="24" />
      </section>

      <section className="space-y-3">
        {supportTickets.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.requester} • Priority: {item.priority}
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

function ScanningView() {
  return (
    <div className="space-y-6">
      <Header
        title="Camera & Scanning"
        description="Configure technical camera and scanning services used by KUHRSA portals."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Scanner Devices" value="4" />
        <StatCard label="Active Sessions" value="2" />
        <StatCard label="Last Test" value="Passed" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="flex aspect-[16/7] items-center justify-center rounded-3xl border border-dashed border-black/10 bg-[#F8FBFC]">
          <div className="text-center">
            <p className="text-sm font-black text-[#0B2633]">
              Camera / Scanning Workspace
            </p>

            <p className="mt-2 text-xs text-black/40">
              Device detection and browser camera controls will be connected
              during integration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function QRView() {
  return (
    <div className="space-y-6">
      <Header
        title="QR Code Management"
        description="Manage QR configuration and secure verification settings."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="QR Types" value="6" />
        <StatCard label="Active Configurations" value="6" />
        <StatCard label="Verification Events" value="284" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["Membership Verification", "Member identity/status reference"],
          ["Event Attendance", "Event attendance reference"],
          ["Activity Participation", "Activity participation reference"],
          ["Meeting Attendance", "Governance meeting reference"],
          ["Certificate Verification", "Certificate authenticity reference"],
          ["Authorized Lookup", "Controlled member lookup reference"],
        ].map(([title, detail]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {title}
            </p>

            <p className="mt-2 text-sm leading-6 text-black/50">
              {detail}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function QRVerificationView() {
  return (
    <div className="space-y-6">
      <Header
        title="QR Verification"
        description="Review secure QR verification activity and supported verification purposes."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Scans" value="284" />
        <StatCard label="Valid" value="276" />
        <StatCard label="Rejected" value="8" />
        <StatCard label="Audit Records" value="284" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Verification Flow
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            "Scan secure reference",
            "Check purpose",
            "Check permissions",
            "Record audit event",
          ].map((item, index) => (
            <div
              key={item}
              className="rounded-2xl bg-[#F8FBFC] p-4"
            >
              <span className="text-xs font-black text-[#CE26A4]">
                0{index + 1}
              </span>

              <p className="mt-2 text-sm font-black text-[#0B2633]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IntegrationsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Integrations"
        description="Monitor external and internal service integrations."
      />

      <section className="space-y-3">
        {integrations.map(([name, provider, status]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Provider: {provider}
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

function HealthView() {
  return (
    <div className="space-y-6">
      <Header
        title="System Health"
        description="Monitor the operating condition of KUHRSA application services."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {systems.map(([name, status, health]) => (
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
                  {status}
                </p>
              </div>

              <Badge value={health} />
            </div>

            <p className="mt-5 text-xs text-black/40">
              Last synthetic health check completed successfully.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function BackupsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Backups"
        description="Monitor application and data backup operations."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Successful Backups" value="124" />
        <StatCard label="Failed Backups" value="0" />
        <StatCard label="Retention" value="30 days" />
      </section>

      <section className="space-y-3">
        {backups.map(([name, date, status]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {date}
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
        title="Technical Logs"
        description="Auditable technical activity across system services and integrations."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["Timestamp", "Activity", "Area"].map((item) => (
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
              {technicalLogs.map(([date, activity, area]) => (
                <tr
                  key={`${date}-${activity}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-xs text-black/50 first:pl-0">
                    {date}
                  </td>

                  <td className="px-3 py-4 text-sm font-black text-[#0B2633]">
                    {activity}
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

export default function AdministrationICTWorkspace({
  view,
}: Props) {
  switch (view) {
    case "website":
      return <WebsiteView />;

    case "support":
      return <SupportView />;

    case "scanning":
      return <ScanningView />;

    case "qr":
      return <QRView />;

    case "qr-verification":
      return <QRVerificationView />;

    case "integrations":
      return <IntegrationsView />;

    case "health":
      return <HealthView />;

    case "backups":
      return <BackupsView />;

    case "logs":
      return <LogsView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
