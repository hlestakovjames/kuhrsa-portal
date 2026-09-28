"use client";

import Link from "next/link";

type SecretariatView =
  | "dashboard"
  | "correspondence"
  | "incoming"
  | "outgoing"
  | "letters"
  | "notices"
  | "requests"
  | "documents"
  | "reports";

type Props = {
  view: SecretariatView;
};

const correspondence = [
  {
    ref: "COR-026",
    subject: "Request for partnership meeting",
    direction: "Incoming",
    date: "04 Sep 2026",
    status: "Open",
  },
  {
    ref: "COR-025",
    subject: "Annual executive communication",
    direction: "Outgoing",
    date: "03 Sep 2026",
    status: "Sent",
  },
  {
    ref: "COR-024",
    subject: "Student affairs coordination",
    direction: "Incoming",
    date: "02 Sep 2026",
    status: "Review",
  },
  {
    ref: "COR-023",
    subject: "Official response to department",
    direction: "Outgoing",
    date: "01 Sep 2026",
    status: "Sent",
  },
];

const requests = [
  {
    title: "Official letter request",
    requester: "Programs Department",
    status: "Pending",
  },
  {
    title: "Meeting documentation request",
    requester: "Executive Committee",
    status: "In Review",
  },
  {
    title: "Administrative clearance request",
    requester: "Events Team",
    status: "Completed",
  },
];

const notices = [
  "Executive committee meeting notice",
  "Membership renewal reminder",
  "Upcoming activities coordination notice",
  "Administrative office schedule",
];

const records = [
  "Correspondence register",
  "Incoming correspondence archive",
  "Outgoing correspondence archive",
  "Official letters register",
  "Administrative notices",
  "Secretariat document index",
  "Secretariat reports",
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
        Secretariat
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
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_20px_rgba(11,38,51,0.03)]">
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
    value === "Sent" ||
    value === "Completed";

  const active =
    value === "Open" ||
    value === "Review" ||
    value === "Pending" ||
    value === "In Review";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : active
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
        title="Secretariat Dashboard"
        description="Administrative oversight of KUHRSA correspondence, official communication, notices, requests and secretariat records."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Correspondence" value="12" />
        <StatCard label="Incoming Today" value="4" />
        <StatCard label="Outgoing Today" value="3" />
        <StatCard label="Open Requests" value="7" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[#0B2633]">
                Recent Correspondence
              </h2>

              <p className="mt-1 text-sm text-black/40">
                Synthetic secretariat records.
              </p>
            </div>

            <Link
              href="/administration/secretariat/correspondence"
              className="text-sm font-black text-[#CE26A4]"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {correspondence.slice(0, 3).map((item) => (
              <div
                key={item.ref}
                className="rounded-2xl bg-[#F8FBFC] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0B2633]">
                      {item.subject}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {item.ref} • {item.direction} • {item.date}
                    </p>
                  </div>

                  <Badge value={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Secretariat Requests
          </h2>

          <div className="mt-5 space-y-3">
            {requests.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/[0.05] p-4"
              >
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.requester}
                </p>

                <div className="mt-3">
                  <Badge value={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Recent Notices
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {notices.map((item) => (
            <Link
              key={item}
              href="/administration/secretariat/notices"
              className="rounded-2xl bg-[#F8FBFC] p-4 text-sm font-bold text-[#0B2633] transition hover:bg-[#FFF7FC]"
            >
              {item}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function CorrespondenceView({
  direction,
}: {
  direction?: "Incoming" | "Outgoing";
}) {
  const data = direction
    ? correspondence.filter(
        (item) => item.direction === direction,
      )
    : correspondence;

  return (
    <div className="space-y-6">
      <Header
        title={
          direction
            ? `${direction} Correspondence`
            : "Correspondence"
        }
        description={
          direction
            ? `Manage ${direction.toLowerCase()} secretariat correspondence.`
            : "Manage and track official KUHRSA correspondence."
        }
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {[
                  "Reference",
                  "Subject",
                  "Direction",
                  "Date",
                  "Status",
                ].map((item) => (
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
              {data.map((item) => (
                <tr
                  key={item.ref}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-xs font-black text-[#CE26A4] first:pl-0">
                    {item.ref}
                  </td>

                  <td className="px-3 py-4 text-sm font-black text-[#0B2633]">
                    {item.subject}
                  </td>

                  <td className="px-3 py-4 text-xs font-semibold text-black/55">
                    {item.direction}
                  </td>

                  <td className="px-3 py-4 text-xs font-semibold text-black/55">
                    {item.date}
                  </td>

                  <td className="px-3 py-4">
                    <Badge value={item.status} />
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

function LettersView() {
  return (
    <div className="space-y-6">
      <Header
        title="Official Letters"
        description="Prepare, track and maintain official KUHRSA letters."
      />

      <section className="grid gap-3 md:grid-cols-2">
        {[
          ["Letter to Academic Affairs", "Draft"],
          ["Partnership invitation", "Pending Approval"],
          ["Executive appointment notification", "Issued"],
          ["Event authorization letter", "Draft"],
        ].map(([title, status]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-black text-[#0B2633]">
                {title}
              </p>

              <Badge value={status} />
            </div>

            <p className="mt-2 text-xs text-black/40">
              Synthetic document record
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function NoticesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Notices"
        description="Manage official KUHRSA administrative notices."
      />

      <section className="space-y-3">
        {notices.map((item) => (
          <div
            key={item}
            className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {item}
            </p>

            <p className="mt-1 text-xs text-black/40">
              Secretariat notice • Synthetic development record
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function RequestsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Administrative Requests"
        description="Track administrative requests received by the KUHRSA Secretariat."
      />

      <section className="space-y-3">
        {requests.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Requested by {item.requester}
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

function DocumentsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Secretariat Documents"
        description="Central workspace for administrative documents maintained by the Secretariat."
      />

      <section className="grid gap-3 sm:grid-cols-2">
        {records.slice(0, 6).map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {item}
            </p>

            <p className="mt-2 text-xs text-black/40">
              Document index • Development placeholder
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Secretariat Reports"
        description="Administrative reporting for correspondence, requests and secretariat operations."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Monthly Correspondence" value="74" />
        <StatCard label="Requests Processed" value="31" />
        <StatCard label="Official Letters" value="22" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Available Reports
        </h2>

        <div className="mt-5 space-y-3">
          {[
            "Incoming correspondence report",
            "Outgoing correspondence report",
            "Administrative requests report",
            "Official letters report",
            "Notice publication report",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-[#F8FBFC] p-4 text-sm font-bold text-[#0B2633]"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AdministrationSecretariatWorkspace({
  view,
}: Props) {
  switch (view) {
    case "correspondence":
      return <CorrespondenceView />;

    case "incoming":
      return <CorrespondenceView direction="Incoming" />;

    case "outgoing":
      return <CorrespondenceView direction="Outgoing" />;

    case "letters":
      return <LettersView />;

    case "notices":
      return <NoticesView />;

    case "requests":
      return <RequestsView />;

    case "documents":
      return <DocumentsView />;

    case "reports":
      return <ReportsView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
