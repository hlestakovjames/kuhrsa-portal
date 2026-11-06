"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/lib/auth";

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

type Props = { view: GovernanceView };

type Position = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isExecutive: boolean;
  status: string;
};

type Term = {
  id: string;
  name: string;
  code: string;
  startsAt: string;
  endsAt: string;
  status: string;
};

type Assignment = {
  id: string;
  status: string;
  startsAt: string;
  endsAt: string;
  assignedAt: string | null;
  member: {
    id: string;
    memberNumber: string;
    email: string | null;
    user: { firstName: string | null; lastName: string | null } | null;
  };
  position: { id: string; name: string; code: string; isExecutive: boolean; status: string };
  term: { id: string; name: string; code: string; startsAt: string; endsAt: string; status: string };
  roles: Array<{ role: { id: string; name: string; code: string } }>;
};

type GovernanceData = {
  positions: Position[];
  terms: Term[];
  assignments: Assignment[];
};

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/+$/, "") ??
  "http://localhost:3001";

function titleCase(value?: string | null) {
  if (!value) return "Not available";
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
}

async function apiRequest<T>(path: string): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Your session is unavailable. Sign in again.");

  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    logout();
    throw new Error("Your session has expired. Sign in again.");
  }
  if (!response.ok) {
    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message;
    throw new Error(message || `Unable to load governance data (HTTP ${response.status}).`);
  }
  if (!Array.isArray(payload)) {
    throw new Error("The governance API returned an unexpected response.");
  }
  return payload as T;
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#CE26A4]">Governance & Leadership</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633]">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">{description}</p>
    </section>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_20px_rgba(11,38,51,0.03)]">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">{value}</p>
      {detail && <p className="mt-1 text-xs text-black/40">{detail}</p>}
    </div>
  );
}

function Badge({ value }: { value: string }) {
  const normalized = value.toUpperCase();
  const positive = ["ACTIVE", "APPROVED", "COMPLETED"].includes(normalized);
  const attention = ["PENDING", "DRAFT"].includes(normalized);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${positive ? "bg-emerald-50 text-emerald-700" : attention ? "bg-amber-50 text-amber-700" : "bg-black/[0.05] text-black/50"}`}>
      {titleCase(value)}
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-black/[0.10] bg-[#F8FBFC] p-8 text-center">
      <p className="text-sm font-black text-[#0B2633]">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black/45">{description}</p>
    </div>
  );
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div role="alert" className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
      <p className="text-sm font-black text-amber-900">Governance data unavailable</p>
      <p className="mt-2 text-sm leading-6 text-amber-800">{message}</p>
      <button type="button" onClick={retry} className="mt-4 rounded-xl bg-[#0B2633] px-4 py-2.5 text-xs font-black text-white">Retry</button>
    </div>
  );
}

function AssignmentRow({ item }: { item: Assignment }) {
  const name = [item.member.user?.firstName, item.member.user?.lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ") || item.member.memberNumber;
  return (
    <article className="rounded-2xl border border-black/[0.05] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#0B2633]">{item.position.name}</p>
          <p className="mt-1 text-xs text-black/50">{name} · {item.member.memberNumber}</p>
          <p className="mt-1 text-xs text-black/40">{item.term.name} · {formatDate(item.startsAt)} – {formatDate(item.endsAt)}</p>
          {item.roles.length > 0 && (
            <p className="mt-2 text-[11px] text-black/40">Assigned roles: {item.roles.map(({ role }) => role.name).join(", ")}</p>
          )}
        </div>
        <Badge value={item.status} />
      </div>
    </article>
  );
}

function UnsupportedView({ view }: { view: GovernanceView }) {
  const labels: Partial<Record<GovernanceView, string>> = {
    committees: "Committee management",
    meetings: "Meeting records",
    agendas: "Meeting agendas",
    attendance: "Meeting attendance",
    minutes: "Meeting minutes",
    resolutions: "Resolutions",
    actions: "Governance action items",
    records: "Governance document records",
  };
  return (
    <div className="space-y-6">
      <Header title={labels[view] ?? "Governance"} description="This area will display organization records once the corresponding backend module and access rules are available." />
      <EmptyState
        title="No connected backend data source"
        description="The current backend supports governance positions, leadership terms and position assignments. It does not yet expose committee, meeting, agenda, attendance, minutes, resolution or action-item records. Demonstration records have been removed from this view."
      />
    </div>
  );
}

export default function AdministrationGovernanceWorkspace({ view }: Props) {
  const [data, setData] = useState<GovernanceData>({ positions: [], terms: [], assignments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [positions, terms, assignments] = await Promise.all([
        view === "dashboard" || view === "positions" || view === "executive" || view === "office-bearers"
          ? apiRequest<Position[]>("/governance/positions")
          : Promise.resolve([] as Position[]),
        view === "dashboard" || view === "terms"
          ? apiRequest<Term[]>("/governance/terms")
          : Promise.resolve([] as Term[]),
        view === "dashboard" || view === "executive" || view === "office-bearers"
          ? apiRequest<Assignment[]>("/governance/assignments")
          : Promise.resolve([] as Assignment[]),
      ]);
      setData({ positions, terms, assignments });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load governance records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (["dashboard", "executive", "office-bearers", "positions", "terms"].includes(view)) {
      void load();
    } else {
      setLoading(false);
    }
    // Reload only when the selected governance view changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  if (["committees", "meetings", "agendas", "attendance", "minutes", "resolutions", "actions", "records"].includes(view)) {
    return <UnsupportedView view={view} />;
  }

  const activeAssignments = data.assignments.filter((item) => item.status === "ACTIVE");
  const pendingAssignments = data.assignments.filter((item) => item.status === "PENDING");
  const activePositions = data.positions.filter((item) => item.status === "ACTIVE");
  const activeTerms = data.terms.filter((item) => item.status === "ACTIVE");

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title="Governance" description="Loading organization governance records from KUHRSA." />
        <div className="rounded-2xl bg-white p-8 text-sm text-black/45 ring-1 ring-black/[0.06]">Loading live governance records…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title="Governance" description="Organization governance records supplied by the backend." />
        <ErrorState message={error} retry={() => void load()} />
      </div>
    );
  }

  if (view === "positions") {
    return (
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title="Positions" description="KUHRSA governance positions loaded from the organization database." />
        {data.positions.length === 0 ? <EmptyState title="No governance positions recorded" description="No positions have been configured for this organization." /> : (
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.positions.map((position, index) => (
              <article key={position.id} className="rounded-2xl bg-white p-4 ring-1 ring-black/[0.06]">
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#CE26A4]">Position {String(index + 1).padStart(2, "0")} · {position.code}</span>
                <p className="mt-2 text-sm font-black text-[#0B2633]">{position.name}</p>
                {position.description && <p className="mt-1 text-xs leading-5 text-black/45">{position.description}</p>}
                <div className="mt-3 flex items-center justify-between gap-2"><span className="text-xs text-black/40">{position.isExecutive ? "Executive position" : "Governance position"}</span><Badge value={position.status} /></div>
              </article>
            ))}
          </section>
        )}
      </div>
    );
  }

  if (view === "terms") {
    return (
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title="Terms of Office" description="Leadership terms and their configured dates and statuses." />
        {data.terms.length === 0 ? <EmptyState title="No leadership terms recorded" description="No terms have been configured for this organization." /> : (
          <section className="grid gap-3 md:grid-cols-2">
            {data.terms.map((term) => (
              <article key={term.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]">
                <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-[#0B2633]">{term.name}</p><p className="mt-1 text-xs text-black/40">{term.code}</p></div><Badge value={term.status} /></div>
                <div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-[10px] font-black uppercase tracking-wider text-black/35">Starts</p><p className="mt-1 text-sm font-bold text-[#0B2633]">{formatDate(term.startsAt)}</p></div><div><p className="text-[10px] font-black uppercase tracking-wider text-black/35">Ends</p><p className="mt-1 text-sm font-bold text-[#0B2633]">{formatDate(term.endsAt)}</p></div></div>
              </article>
            ))}
          </section>
        )}
      </div>
    );
  }

  if (view === "executive" || view === "office-bearers") {
    const heading = view === "executive" ? "Executive Committee" : "Office Bearers";
    return (
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title={heading} description="Appointments and office bearers from the live organization-scoped governance assignment register." />
        {data.assignments.length === 0 ? <EmptyState title="No position assignments recorded" description="The backend has not returned any appointments for this organization." /> : (
          <section className="space-y-3">
            {data.assignments.map((item) => <AssignmentRow key={item.id} item={item} />)}
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Header title="Governance Dashboard" description="Current organization positions, leadership terms and appointment status from the KUHRSA governance backend." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Executive Positions" value={String(data.positions.filter((item) => item.isExecutive).length)} detail={`${activePositions.length} active positions overall`} />
        <StatCard label="Active Office Bearers" value={String(activeAssignments.length)} detail="Current active appointments" />
        <StatCard label="Pending Assignments" value={String(pendingAssignments.length)} detail="Awaiting activation" />
        <StatCard label="Active Terms" value={String(activeTerms.length)} detail={`${data.terms.length} terms configured`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">Executive Structure</h2>
          <p className="mt-1 text-sm text-black/40">Configured executive positions and their current assignment state.</p>
          <div className="mt-5 space-y-2">
            {data.positions.filter((item) => item.isExecutive).map((position) => {
              const assignment = activeAssignments.find((item) => item.position.id === position.id);
              const holder = assignment
                ? [assignment.member.user?.firstName, assignment.member.user?.lastName].filter(Boolean).join(" ") || assignment.member.memberNumber
                : "No active appointment";
              return (
                <div key={position.id} className="flex flex-col gap-2 rounded-2xl bg-[#F8FBFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-sm font-semibold text-[#0B2633]">{position.name}</p><p className="mt-0.5 text-xs text-black/40">{holder}</p></div>
                  <Badge value={assignment ? assignment.status : position.status === "ACTIVE" ? "VACANT" : position.status} />
                </div>
              );
            })}
          </div>
          <Link href="/administration/governance/positions" className="mt-5 inline-flex text-sm font-black text-[#CE26A4]">View all positions →</Link>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">Current Appointments</h2>
          <p className="mt-1 text-sm text-black/40">Latest position assignments returned by the backend.</p>
          <div className="mt-5 space-y-3">
            {data.assignments.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-2xl border border-black/[0.05] p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-[#0B2633]">{item.position.name}</p><p className="mt-1 text-xs text-black/45">{[item.member.user?.firstName, item.member.user?.lastName].filter(Boolean).join(" ") || item.member.memberNumber}</p><p className="mt-1 text-[11px] text-black/40">{item.term.name}</p></div><Badge value={item.status} /></div>
              </div>
            ))}
            {data.assignments.length === 0 && <p className="text-sm text-black/45">No appointments have been recorded.</p>}
          </div>
          <Link href="/administration/governance/office-bearers" className="mt-5 inline-flex text-sm font-black text-[#CE26A4]">View office bearers →</Link>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-lg font-black text-[#0B2633]">Leadership Terms</h2><p className="mt-1 text-sm text-black/40">Configured term records, not assumed calendar cycles.</p></div>
          <Link href="/administration/governance/terms" className="text-sm font-black text-[#CE26A4]">View terms →</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.terms.slice(0, 4).map((term) => <div key={term.id} className="rounded-2xl bg-[#F8FBFC] p-4"><div className="flex items-start justify-between gap-3"><p className="text-sm font-black text-[#0B2633]">{term.name}</p><Badge value={term.status} /></div><p className="mt-2 text-xs text-black/45">{formatDate(term.startsAt)} – {formatDate(term.endsAt)}</p></div>)}
          {data.terms.length === 0 && <p className="text-sm text-black/45">No terms have been configured.</p>}
        </div>
      </section>
    </div>
  );
}
