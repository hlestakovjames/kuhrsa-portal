"use client";

import Link from "next/link";

type GovernanceView =
  | "dashboard"
  | "executive"
  | "office-bearers"
  | "positions"
  | "terms"
  | "committees"
  | "meetings"
  | "agendas"
  | "attendance"
  | "minutes"
  | "resolutions"
  | "actions"
  | "records";

type Props = {
  view: GovernanceView;
};

const positions = [
  "Chairperson",
  "Vice Chairperson",
  "Secretary General",
  "Deputy Secretary General",
  "Treasurer",
  "Deputy Treasurer",
  "Publicity Secretary",
  "Deputy Publicity Secretary",
  "Organizing Secretary",
  "Deputy Organizing Secretary",
  "Legal Affairs Officer",
  "Legal Representative – Year 1",
  "Legal Representative – Year 2",
  "Legal Representative – Year 3",
  "Legal Representative – Year 4",
  "ICT Manager",
];

const officeBearers = [
  {
    position: "Chairperson",
    status: "Assigned",
    term: "2026/27",
  },
  {
    position: "Secretary General",
    status: "Assigned",
    term: "2026/27",
  },
  {
    position: "Treasurer",
    status: "Assigned",
    term: "2026/27",
  },
  {
    position: "Organizing Secretary",
    status: "Assigned",
    term: "2026/27",
  },
  {
    position: "ICT Manager",
    status: "Assigned",
    term: "2026/27",
  },
];

const committees = [
  {
    name: "Executive Committee",
    chair: "Chairperson",
    members: 16,
    status: "Active",
  },
  {
    name: "Finance Committee",
    chair: "Treasurer",
    members: 6,
    status: "Active",
  },
  {
    name: "Programs & Activities Committee",
    chair: "Organizing Secretary",
    members: 7,
    status: "Active",
  },
  {
    name: "Communications Committee",
    chair: "Publicity Secretary",
    members: 5,
    status: "Active",
  },
];

const meetings = [
  {
    title: "Executive Committee Meeting",
    date: "12 Sep 2026",
    venue: "KUHRSA Board Room",
    status: "Scheduled",
  },
  {
    title: "Finance Review Meeting",
    date: "16 Sep 2026",
    venue: "Finance Office",
    status: "Scheduled",
  },
  {
    title: "Programs Planning Meeting",
    date: "20 Sep 2026",
    venue: "Student Centre",
    status: "Scheduled",
  },
];

const resolutions = [
  {
    title: "Approve annual membership cycle",
    meeting: "Executive Committee Meeting",
    status: "Approved",
  },
  {
    title: "Adopt events planning framework",
    meeting: "Programs Planning Meeting",
    status: "Pending Implementation",
  },
  {
    title: "Approve financial reporting schedule",
    meeting: "Finance Review Meeting",
    status: "Approved",
  },
];

const actions = [
  {
    task: "Prepare annual membership report",
    owner: "Secretary General",
    due: "18 Sep 2026",
    status: "In Progress",
  },
  {
    task: "Complete budget review",
    owner: "Treasurer",
    due: "21 Sep 2026",
    status: "Pending",
  },
  {
    task: "Publish upcoming activities calendar",
    owner: "Publicity Secretary",
    due: "14 Sep 2026",
    status: "Completed",
  },
];

const governanceRecords = [
  "Current executive committee record",
  "2026/27 office bearer register",
  "Current terms of office",
  "Committee appointment records",
  "Approved meeting minutes",
  "Governance resolutions archive",
  "Outstanding governance action items",
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
        Governance & Leadership
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
    value === "Assigned" ||
    value === "Active" ||
    value === "Approved" ||
    value === "Completed";

  const attention =
    value === "Pending" ||
    value === "Pending Implementation" ||
    value === "In Progress" ||
    value === "Scheduled";

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
        title="Governance Dashboard"
        description="Central administrative oversight of KUHRSA leadership, office bearers, terms, committees, meetings, resolutions and governance records."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Executive Positions" value="16" />
        <StatCard label="Office Bearers" value="16" />
        <StatCard label="Active Committees" value="4" />
        <StatCard label="Upcoming Meetings" value="3" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Executive Structure
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Current synthetic governance structure for development.
          </p>

          <div className="mt-5 space-y-2">
            {positions.slice(0, 8).map((position) => (
              <div
                key={position}
                className="flex items-center justify-between rounded-2xl bg-[#F8FBFC] px-4 py-3"
              >
                <span className="text-sm font-semibold text-[#0B2633]">
                  {position}
                </span>

                <Badge value="Assigned" />
              </div>
            ))}
          </div>

          <Link
            href="/administration/governance/positions"
            className="mt-5 inline-flex text-sm font-black text-[#CE26A4]"
          >
            View all positions →
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Upcoming Governance
          </h2>

          <div className="mt-5 space-y-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.title}
                className="rounded-2xl border border-black/[0.05] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0B2633]">
                      {meeting.title}
                    </p>

                    <p className="mt-1 text-xs text-black/45">
                      {meeting.date} • {meeting.venue}
                    </p>
                  </div>

                  <Badge value={meeting.status} />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/administration/governance/meetings"
            className="mt-5 inline-flex text-sm font-black text-[#CE26A4]"
          >
            View meetings →
          </Link>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0B2633]">
              Governance Action Items
            </h2>

            <p className="mt-1 text-sm text-black/40">
              Current synthetic governance follow-ups.
            </p>
          </div>

          <Link
            href="/administration/governance/actions"
            className="text-sm font-black text-[#CE26A4]"
          >
            Open action register →
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {actions.map((item) => (
            <div
              key={item.task}
              className="rounded-2xl bg-[#F8FBFC] p-4"
            >
              <p className="text-sm font-black text-[#0B2633]">
                {item.task}
              </p>

              <p className="mt-2 text-xs text-black/45">
                Owner: {item.owner}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-black/40">
                  Due {item.due}
                </span>

                <Badge value={item.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ExecutiveView() {
  return (
    <div className="space-y-6">
      <Header
        title="Executive Committee"
        description="Administrative view of the current KUHRSA executive leadership structure."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="grid gap-3 md:grid-cols-2">
          {officeBearers.map((item) => (
            <div
              key={item.position}
              className="rounded-2xl border border-black/[0.05] p-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
                Position
              </p>

              <p className="mt-2 text-sm font-black text-[#0B2633]">
                {item.position}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-black/45">
                  Term {item.term}
                </span>

                <Badge value={item.status} />
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/administration/governance/office-bearers"
          className="mt-5 inline-flex text-sm font-black text-[#CE26A4]"
        >
          Open office bearer register →
        </Link>
      </section>
    </div>
  );
}

function OfficeBearersView() {
  return (
    <div className="space-y-6">
      <Header
        title="Office Bearers"
        description="Maintain the administrative register of appointed KUHRSA office bearers."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["Position", "Term", "Status"].map((item) => (
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
              {officeBearers.map((item) => (
                <tr
                  key={item.position}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-black text-[#0B2633] first:pl-0">
                    {item.position}
                  </td>
                  <td className="px-3 py-4 text-xs text-black/55">
                    {item.term}
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

function PositionsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Positions"
        description="KUHRSA's configured executive and governance positions."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {positions.map((position, index) => (
          <div
            key={position}
            className="rounded-2xl bg-white p-4 ring-1 ring-black/[0.06]"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#CE26A4]">
              Position {String(index + 1).padStart(2, "0")}
            </span>

            <p className="mt-2 text-sm font-black text-[#0B2633]">
              {position}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function TermsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Terms of Office"
        description="Track executive appointments, term periods and governance tenure."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Current Term", "2026/27"],
            ["Start Date", "01 Sep 2026"],
            ["Review Cycle", "Annual"],
            ["Executive Positions", "16"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl bg-[#F8FBFC] p-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                {label}
              </p>

              <p className="mt-2 text-sm font-black text-[#0B2633]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CommitteesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Committees"
        description="Manage governance committees and their assigned leadership."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {committees.map((item) => (
          <div
            key={item.name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-black text-[#0B2633]">
                {item.name}
              </h2>

              <Badge value={item.status} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatCard label="Chair" value={item.chair} />
              <StatCard label="Members" value={String(item.members)} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function MeetingsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Meetings"
        description="Schedule and oversee KUHRSA governance meetings."
      />

      <section className="space-y-3">
        {meetings.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/45">
                  {item.date} • {item.venue}
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

function AgendasView() {
  return (
    <div className="space-y-6">
      <Header
        title="Agendas"
        description="Prepare and manage meeting agendas."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="space-y-3">
          {[
            "Membership performance and applications",
            "Financial review",
            "Upcoming events and activities",
            "Executive appointments and terms",
            "Communications and publicity",
            "Any other business",
          ].map((item, index) => (
            <div
              key={item}
              className="flex gap-4 rounded-2xl bg-[#F8FBFC] p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#CE26A4]/10 text-xs font-black text-[#CE26A4]">
                {index + 1}
              </span>

              <p className="text-sm font-semibold text-[#0B2633]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AttendanceView() {
  return (
    <div className="space-y-6">
      <Header
        title="Meeting Attendance"
        description="Track attendance at governance and executive meetings."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Latest Meeting" value="14 Attendees" />
        <StatCard label="Average Attendance" value="88%" />
        <StatCard label="Pending Records" value="2" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="space-y-3">
          {[
            ["Executive Committee Meeting", "14 / 16"],
            ["Finance Review Meeting", "6 / 6"],
            ["Programs Planning Meeting", "7 / 7"],
          ].map(([meeting, attendance]) => (
            <div
              key={meeting}
              className="flex items-center justify-between rounded-2xl bg-[#F8FBFC] px-4 py-4"
            >
              <span className="text-sm font-black text-[#0B2633]">
                {meeting}
              </span>

              <span className="text-sm font-black text-[#CE26A4]">
                {attendance}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MinutesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Minutes"
        description="Store and review approved governance meeting minutes."
      />

      <section className="space-y-3">
        {[
          "Executive Committee Meeting — 29 Aug 2026",
          "Finance Review Meeting — 25 Aug 2026",
          "Programs Planning Meeting — 21 Aug 2026",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <div>
              <p className="text-sm font-black text-[#0B2633]">
                {item}
              </p>

              <p className="mt-1 text-xs text-black/40">
                Approved governance record
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl border border-black/[0.08] px-4 py-2 text-xs font-black text-[#0B2633]"
            >
              View
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

function ResolutionsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Resolutions"
        description="Track decisions adopted through KUHRSA governance meetings."
      />

      <section className="space-y-3">
        {resolutions.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Source: {item.meeting}
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

function ActionsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Action Items"
        description="Track governance actions, responsible officers and completion status."
      />

      <section className="space-y-3">
        {actions.map((item) => (
          <div
            key={item.task}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.task}
                </p>

                <p className="mt-1 text-xs text-black/45">
                  Owner: {item.owner} • Due: {item.due}
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

function RecordsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Governance Records"
        description="Central index of KUHRSA governance and leadership records."
      />

      <section className="grid gap-3 sm:grid-cols-2">
        {governanceRecords.map((item, index) => (
          <div
            key={item}
            className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <div className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#CE26A4]/10 text-xs font-black text-[#CE26A4]">
                {index + 1}
              </span>

              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Synthetic development record
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function AdministrationGovernanceWorkspace({
  view,
}: Props) {
  switch (view) {
    case "executive":
      return <ExecutiveView />;

    case "office-bearers":
      return <OfficeBearersView />;

    case "positions":
      return <PositionsView />;

    case "terms":
      return <TermsView />;

    case "committees":
      return <CommitteesView />;

    case "meetings":
      return <MeetingsView />;

    case "agendas":
      return <AgendasView />;

    case "attendance":
      return <AttendanceView />;

    case "minutes":
      return <MinutesView />;

    case "resolutions":
      return <ResolutionsView />;

    case "actions":
      return <ActionsView />;

    case "records":
      return <RecordsView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
