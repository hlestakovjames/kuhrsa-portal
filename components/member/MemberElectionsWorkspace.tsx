"use client";

import Link from "next/link";

import { memberElectionsMock } from "@/lib/mock/member-elections";

type ElectionsView =
  | "overview"
  | "active"
  | "information"
  | "candidates"
  | "eligibility"
  | "voting"
  | "record"
  | "results";

type MemberElectionsWorkspaceProps = {
  view: ElectionsView;
};

const mock = memberElectionsMock;

function statusClass(status: string) {
  switch (status) {
    case "Active":
    case "Eligible":
    case "Recorded":
    case "Published":
      return "bg-emerald-50 text-emerald-700";

    case "Upcoming":
      return "bg-[#168DB8]/10 text-[#168DB8]";

    case "Completed":
      return "bg-black/[0.04] text-black/50";

    case "Not Yet Voted":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-black/[0.04] text-black/55";
  }
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#F8FBFC] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function ActionLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm font-bold text-[#0B2633] transition hover:border-[#168DB8]/20 hover:bg-[#168DB8]/5"
    >
      {label}

      <span className="text-[#168DB8] transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#168DB8]">
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

export default function MemberElectionsWorkspace({
  view,
}: MemberElectionsWorkspaceProps) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {view === "overview" && (
        <>
          <Header
            title="Elections Overview"
            description="Review KUHRSA elections, eligibility, candidates, voting information and published results."
          />

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              label="Active Elections"
              value={String(
                mock.overview.activeElections,
              )}
            />

            <InfoTile
              label="Upcoming Elections"
              value={String(
                mock.overview.upcomingElections,
              )}
            />

            <InfoTile
              label="Completed Elections"
              value={String(
                mock.overview.completedElections,
              )}
            />

            <InfoTile
              label="Voting Eligibility"
              value={mock.overview.votingStatus}
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                    Current Election
                  </p>

                  <h2 className="mt-1 text-xl font-black text-[#0B2633]">
                    {mock.elections[0].title}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                    mock.elections[0].status,
                  )}`}
                >
                  {mock.elections[0].status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-black/50">
                {mock.elections[0].description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <InfoTile
                  label="Opens"
                  value={
                    mock.elections[0].openingDate
                  }
                />

                <InfoTile
                  label="Closes"
                  value={
                    mock.elections[0].closingDate
                  }
                />

                <InfoTile
                  label="Positions"
                  value={String(
                    mock.elections[0].positions,
                  )}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Election Services
              </p>

              <div className="mt-4 space-y-2">
                <ActionLink
                  href="/dashboard/elections/active"
                  label="Active Elections"
                />

                <ActionLink
                  href="/dashboard/elections/candidates"
                  label="Candidates"
                />

                <ActionLink
                  href="/dashboard/elections/eligibility"
                  label="Check Eligibility"
                />

                <ActionLink
                  href="/dashboard/elections/voting"
                  label="Voting"
                />

                <ActionLink
                  href="/dashboard/elections/results"
                  label="Results"
                />
              </div>
            </div>
          </section>
        </>
      )}

      {view === "active" && (
        <>
          <Header
            title="Active Elections"
            description="View elections that are currently open or accepting member participation."
          />

          <section className="mt-6 space-y-4">
            {mock.elections
              .filter(
                (election) =>
                  election.status === "Active",
              )
              .map((election) => (
                <div
                  key={election.id}
                  className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                          election.status,
                        )}`}
                      >
                        {election.status}
                      </span>

                      <h2 className="mt-3 text-xl font-black text-[#0B2633]">
                        {election.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-black/50">
                        {election.description}
                      </p>
                    </div>

                    <Link
                      href="/dashboard/elections/information"
                      className="rounded-xl bg-[#168DB8] px-4 py-2.5 text-xs font-black text-white hover:bg-[#11799D]"
                    >
                      View Election
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <InfoTile
                      label="Opening Date"
                      value={
                        election.openingDate
                      }
                    />

                    <InfoTile
                      label="Closing Date"
                      value={
                        election.closingDate
                      }
                    />

                    <InfoTile
                      label="Positions"
                      value={String(
                        election.positions,
                      )}
                    />
                  </div>
                </div>
              ))}
          </section>
        </>
      )}

      {view === "information" && (
        <>
          <Header
            title="Election Information"
            description="Review the key information for the current KUHRSA election."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-black text-[#0B2633]">
                {mock.elections[0].title}
              </h2>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                  mock.elections[0].status,
                )}`}
              >
                {mock.elections[0].status}
              </span>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-black/50">
              {mock.elections[0].description}
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoTile
                label="Opens"
                value={
                  mock.elections[0].openingDate
                }
              />

              <InfoTile
                label="Closes"
                value={
                  mock.elections[0].closingDate
                }
              />

              <InfoTile
                label="Positions"
                value={String(
                  mock.elections[0].positions,
                )}
              />

              <InfoTile
                label="Eligibility"
                value={mock.eligibility.status}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-[#F8FBFC] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Member Guidance
              </p>

              <p className="mt-2 text-sm leading-6 text-black/50">
                Review eligibility and candidate
                information before participating in
                an active election. Production
                election rules will be provided by the
                election administration service.
              </p>
            </div>
          </section>
        </>
      )}

      {view === "candidates" && (
        <>
          <Header
            title="Candidates"
            description="Review candidates standing for positions in the current election."
          />

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {mock.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#168DB8]">
                      {candidate.position}
                    </p>

                    <h2 className="mt-2 text-lg font-black text-[#0B2633]">
                      {candidate.name}
                    </h2>

                    <p className="mt-1 text-xs text-black/40">
                      {candidate.category}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F8FBFC] px-2.5 py-1 text-[10px] font-bold text-black/45">
                    Candidate
                  </span>
                </div>

                <p className="mt-4 text-xs leading-5 text-black/40">
                  {candidate.election}
                </p>
              </div>
            ))}
          </section>
        </>
      )}

      {view === "eligibility" && (
        <>
          <Header
            title="Eligibility"
            description="Review your eligibility status for the active KUHRSA election."
          />

          <section className="mt-6 rounded-3xl bg-[#0B2633] p-7 text-white shadow-[0_18px_50px_rgba(11,38,51,0.14)] sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
              Election Eligibility
            </p>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-3xl font-black">
                {mock.eligibility.status}
              </h2>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                  mock.eligibility.status,
                )}`}
              >
                Eligible
              </span>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/55">
              {mock.eligibility.reason}
            </p>

            <div className="mt-7 rounded-2xl bg-white/[0.06] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
                Election
              </p>

              <p className="mt-2 text-sm font-bold text-white/80">
                {mock.eligibility.election}
              </p>
            </div>
          </section>
        </>
      )}

      {view === "voting" && (
        <>
          <Header
            title="Voting"
            description="Review the voting status and instructions for an active KUHRSA election."
          />

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                    Current Election
                  </p>

                  <h2 className="mt-2 text-xl font-black text-[#0B2633]">
                    {mock.voting.election}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                    mock.voting.status,
                  )}`}
                >
                  {mock.voting.status}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.13em] text-black/35">
                  Voting Instructions
                </p>

                <div className="mt-3 space-y-3">
                  {mock.voting.instructions.map(
                    (instruction, index) => (
                      <div
                        key={instruction}
                        className="flex gap-3 rounded-xl bg-[#F8FBFC] p-4"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#168DB8] text-[10px] font-black text-white">
                          {index + 1}
                        </span>

                        <p className="text-sm leading-6 text-black/55">
                          {instruction}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-dashed border-black/10 bg-[#F8FBFC] p-5">
                <p className="text-sm font-black text-[#0B2633]">
                  Voting interface placeholder
                </p>

                <p className="mt-2 text-xs leading-5 text-black/45">
                  The production voting interface will
                  be connected to the election backend
                  after the frontend election workflow is
                  finalized.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#168DB8]/10 bg-[#168DB8]/5 p-6">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Voting Status
              </p>

              <p className="mt-3 text-2xl font-black text-[#0B2633]">
                {mock.voting.status}
              </p>

              <p className="mt-3 text-sm leading-6 text-black/50">
                No real vote is being submitted by this
                development workspace.
              </p>
            </div>
          </section>
        </>
      )}

      {view === "record" && (
        <>
          <Header
            title="My Voting Record"
            description="Review your recorded participation in previous KUHRSA elections."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] text-left">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Election
                    </th>

                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Date
                    </th>

                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {mock.votingRecord.map(
                    (record) => (
                      <tr
                        key={record.id}
                        className="border-b border-black/[0.04]"
                      >
                        <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                          {record.election}
                        </td>

                        <td className="px-4 py-4 text-sm text-black/50">
                          {record.date}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                              record.status,
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {view === "results" && (
        <>
          <Header
            title="Results"
            description="View published results of completed KUHRSA elections."
          />

          <section className="mt-6 space-y-4">
            {mock.results.map((result) => (
              <div
                key={result.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#168DB8]">
                      Published Result
                    </p>

                    <h2 className="mt-2 text-lg font-black text-[#0B2633]">
                      {result.election}
                    </h2>

                    <p className="mt-1 text-xs text-black/40">
                      Published{" "}
                      {result.publishedDate}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                      result.status,
                    )}`}
                  >
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
