"use client";

import Link from "next/link";

type ElectionsView =
  | "dashboard"
  | "elections"
  | "positions"
  | "candidates"
  | "eligibility"
  | "voters"
  | "voting"
  | "results"
  | "reports"
  | "audit";

type Props = {
  view: ElectionsView;
};

const elections = [
  {
    name: "KUHRSA Executive Elections 2027",
    cycle: "2026/27",
    status: "Planning",
    positions: 16,
    candidates: 42,
  },
  {
    name: "Faculty Representative Election",
    cycle: "2026/27",
    status: "Upcoming",
    positions: 3,
    candidates: 9,
  },
];

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

const candidates = [
  {
    name: "Alex Morgan",
    position: "Chairperson",
    status: "Eligible",
  },
  {
    name: "Brian Otieno",
    position: "Treasurer",
    status: "Under Review",
  },
  {
    name: "Cynthia Wambui",
    position: "Secretary General",
    status: "Eligible",
  },
  {
    name: "Daniel Kariuki",
    position: "ICT Manager",
    status: "Approved",
  },
];

const voters = [
  {
    member: "KUHRSA-STD-0042",
    category: "Student",
    eligibility: "Eligible",
    status: "Registered",
  },
  {
    member: "KUHRSA-STD-0077",
    category: "Student",
    eligibility: "Eligible",
    status: "Registered",
  },
  {
    member: "KUHRSA-ALU-0018",
    category: "Alumni",
    eligibility: "Eligible",
    status: "Registered",
  },
  {
    member: "KUHRSA-LCT-0009",
    category: "Lecturer",
    eligibility: "Eligible",
    status: "Registered",
  },
];

const auditEvents = [
  "Election cycle created",
  "Candidate nomination window opened",
  "Voter eligibility rules configured",
  "Candidate eligibility review completed",
  "Election settings updated",
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
        Elections
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
    value === "Eligible" ||
    value === "Approved" ||
    value === "Registered" ||
    value === "Completed";

  const attention =
    value === "Planning" ||
    value === "Upcoming" ||
    value === "Under Review" ||
    value === "Pending";

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
        title="Elections Dashboard"
        description="Administrative oversight of election cycles, positions, candidates, voter eligibility, voting, results and election audit records."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Election Cycles" value="2" />
        <StatCard label="Election Positions" value="16" />
        <StatCard label="Candidates" value="42" />
        <StatCard label="Eligible Voters" value="1,146" />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2633]">
            Election Cycles
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Synthetic election administration data.
          </p>
        </div>

        {elections.map((election) => (
          <div
            key={election.name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-black text-[#0B2633]">
                  {election.name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Cycle {election.cycle} • {election.positions} positions •{" "}
                  {election.candidates} candidates
                </p>
              </div>

              <Badge value={election.status} />
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Election Operations
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Positions", "/administration/elections/positions"],
            ["Candidates", "/administration/elections/candidates"],
            ["Voter Register", "/administration/elections/voters"],
            ["Eligibility", "/administration/elections/eligibility"],
            ["Voting", "/administration/elections/voting"],
            ["Results", "/administration/elections/results"],
            ["Reports", "/administration/elections/reports"],
            ["Audit", "/administration/elections/audit"],
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

function ElectionsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Elections"
        description="Manage election cycles and their administrative configuration."
      />

      {elections.map((election) => (
        <section
          key={election.name}
          className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-[#0B2633]">
                {election.name}
              </h2>

              <p className="mt-1 text-xs text-black/40">
                Cycle {election.cycle}
              </p>
            </div>

            <Badge value={election.status} />
          </div>
        </section>
      ))}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
          Development Mode
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          Election operations are currently represented with synthetic data.
          Actual election creation, controls and voting will be enforced by
          the backend authorization system.
        </p>
      </div>
    </div>
  );
}

function PositionsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Election Positions"
        description="Configure the positions available within a KUHRSA election."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {positions.map((position, index) => (
          <div
            key={position}
            className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#CE26A4]">
              Position {String(index + 1).padStart(2, "0")}
            </p>

            <p className="mt-2 text-sm font-black text-[#0B2633]">
              {position}
            </p>

            <p className="mt-2 text-xs text-black/40">
              Configurable election position
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function CandidatesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Candidates"
        description="Review and manage election candidates."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["Candidate", "Position", "Status"].map((item) => (
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
              {candidates.map((candidate) => (
                <tr
                  key={`${candidate.name}-${candidate.position}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-black text-[#0B2633] first:pl-0">
                    {candidate.name}
                  </td>

                  <td className="px-3 py-4 text-xs font-semibold text-black/55">
                    {candidate.position}
                  </td>

                  <td className="px-3 py-4">
                    <Badge value={candidate.status} />
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

function EligibilityView() {
  return (
    <div className="space-y-6">
      <Header
        title="Eligibility"
        description="Define and review candidate and voter eligibility rules."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {[
          [
            "Membership Status",
            "Member must have an eligible current membership.",
          ],
          [
            "Membership Period",
            "Member must belong to the active election cycle.",
          ],
          [
            "Candidate Requirements",
            "Position-specific requirements are checked before approval.",
          ],
          [
            "Voting Eligibility",
            "Only eligible registered voters may participate.",
          ],
        ].map(([title, detail]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <h2 className="text-sm font-black text-[#0B2633]">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/50">
              {detail}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function VotersView() {
  return (
    <div className="space-y-6">
      <Header
        title="Voter Register"
        description="Review the administrative election voter register."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Registered Voters" value="1,146" />
        <StatCard label="Eligible Voters" value="1,102" />
        <StatCard label="Requires Review" value="44" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["Member Number", "Category", "Eligibility", "Status"].map(
                  (item) => (
                    <th
                      key={item}
                      className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0"
                    >
                      {item}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {voters.map((voter) => (
                <tr
                  key={voter.member}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-black text-[#0B2633] first:pl-0">
                    {voter.member}
                  </td>

                  <td className="px-3 py-4 text-xs text-black/55">
                    {voter.category}
                  </td>

                  <td className="px-3 py-4">
                    <Badge value={voter.eligibility} />
                  </td>

                  <td className="px-3 py-4">
                    <Badge value={voter.status} />
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

function VotingView() {
  return (
    <div className="space-y-6">
      <Header
        title="Voting"
        description="Administrative controls and monitoring for an active election."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Eligible Voters" value="1,102" />
        <StatCard label="Votes Cast" value="684" />
        <StatCard label="Participation" value="62%" />
        <StatCard label="Election Status" value="Not Started" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Election Control Centre
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            "Open voting period",
            "Pause voting",
            "Close voting",
            "Review voting status",
          ].map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-2xl border border-black/[0.08] bg-[#F8FBFC] p-4 text-left text-sm font-bold text-[#0B2633] transition hover:bg-[#FFF7FC]"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
          Frontend Placeholder
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          Voting controls do not perform real election actions in the mock
          frontend.
        </p>
      </div>
    </div>
  );
}

function ResultsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Results"
        description="Review election results and outcome summaries."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Positions Contested" value="16" />
        <StatCard label="Votes Counted" value="684" />
        <StatCard label="Positions Finalized" value="0" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Result Status
        </h2>

        <p className="mt-2 text-sm leading-6 text-black/50">
          Election results will appear here after the authorized election
          process is completed and verified.
        </p>
      </section>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Election Reports"
        description="Administrative reports covering election participation, eligibility, candidates and results."
      />

      <section className="grid gap-3 sm:grid-cols-2">
        {[
          "Election participation report",
          "Candidate eligibility report",
          "Voter register report",
          "Voting activity report",
          "Election result report",
          "Election cycle summary",
        ].map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {item}
            </p>

            <p className="mt-2 text-xs text-black/40">
              Synthetic report definition
            </p>
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
        title="Election Audit"
        description="Auditable record of election configuration and administrative actions."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="space-y-3">
          {auditEvents.map((event, index) => (
            <div
              key={event}
              className="flex items-start gap-4 rounded-2xl bg-[#F8FBFC] p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#CE26A4]/10 text-xs font-black text-[#CE26A4]">
                {index + 1}
              </span>

              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {event}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Synthetic audit event • Election Administration
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AdministrationElectionsWorkspace({
  view,
}: Props) {
  switch (view) {
    case "elections":
      return <ElectionsView />;

    case "positions":
      return <PositionsView />;

    case "candidates":
      return <CandidatesView />;

    case "eligibility":
      return <EligibilityView />;

    case "voters":
      return <VotersView />;

    case "voting":
      return <VotingView />;

    case "results":
      return <ResultsView />;

    case "reports":
      return <ReportsView />;

    case "audit":
      return <AuditView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
