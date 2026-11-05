"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getToken, logout } from "@/lib/auth";

type FinanceView = "overview" | "fees" | "payment" | "history" | "balance" | "receipts" | "statements";
type FinanceData = {
  member: { id: string; memberNumber: string; registrationNumber?: string | null; category: string; status: string; financialStatus: string };
  membershipPeriods: Array<{ id: string; membershipYear: string; startsAt: string; endsAt: string; status: string; activatedAt?: string | null }>;
  charges: Array<{
    id: string; description?: string | null; amountDue: number | string; amountPaid: number | string; balance: number | string;
    currency: string; status: string; dueDate?: string | null; createdAt: string;
    feeSchedule?: { name?: string; feeDefinition?: { name?: string; code?: string; type?: string } } | null;
    membershipPeriod?: { membershipYear: string; startsAt: string; endsAt: string } | null;
    allocations?: Array<{ amount: number | string; payment?: { id: string; method: string; status: string; reference?: string | null; paidAt?: string | null } }>;
  }>;
  payments: Array<{
    id: string; amount: number | string; currency: string; method: string; status: string;
    reference?: string | null; externalReference?: string | null; description?: string | null; paidAt?: string | null; createdAt: string;
    allocations?: Array<{ amount: number | string; charge?: { description?: string | null } }>;
    receipt?: { id: string; receiptNumber: string; status: string; issuedAt: string } | null;
  }>;
  receipts: Array<{
    id: string; receiptNumber: string; status: string; amount: number | string; currency: string;
    issuedAt: string; voidedAt?: string | null; voidReason?: string | null;
    payment?: { reference?: string | null; method: string; status: string; paidAt?: string | null };
  }>;
  summary: { currency: string; totalCharged: number; allocatedPaid: number; outstandingBalance: number; completedPaymentsAmount: number; unallocatedCompletedPayments: number };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\\/+$/, "") ?? "http://localhost:3001";
const money = (value: number | string, currency = "KES") => new Intl.NumberFormat("en-KE", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value || 0));
const date = (value?: string | null) => value ? new Date(value).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const statusStyle = (value: string) => ["COMPLETED", "PAID", "ISSUED", "ACTIVE"].includes(value) ? "bg-emerald-50 text-emerald-700" : ["PENDING", "PROCESSING", "PARTIALLY_PAID"].includes(value) ? "bg-amber-50 text-amber-700" : ["FAILED", "CANCELLED", "VOIDED", "REJECTED"].includes(value) ? "bg-rose-50 text-rose-700" : "bg-black/[0.05] text-black/55";

function Status({ value }: { value: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusStyle(value)}`}>{value.replaceAll("_", " ")}</span>;
}
function Tile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-black/[0.06] bg-[#F8FBFC] p-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">{label}</p><p className="mt-2 break-words text-sm font-bold text-[#0B2633]">{value}</p></div>;
}
function Header({ title, description }: { title: string; description: string }) {
  return <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8"><p className="text-xs font-black uppercase tracking-[0.17em] text-[#168DB8]">Finance</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633]">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">{description}</p></section>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-black/10 bg-white p-8 text-center text-sm text-black/45">{children}</div>;
}

export default function MemberFinanceWorkspace({ view }: { view: FinanceView }) {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const token = getToken();
    if (!token) { setLoading(false); setError("Your session has expired. Please sign in again."); return; }
    try {
      const response = await fetch(`${API_URL}/finance/member/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const payload = await response.json().catch(() => null);
      if (response.status === 401) { logout(); throw new Error("Your session has expired. Please sign in again."); }
      if (!response.ok) throw new Error(Array.isArray(payload?.message) ? payload.message.join(", ") : payload?.message || "Your finance information could not be loaded.");
      setData(payload as FinanceData);
    } catch (e) { setError(e instanceof Error ? e.message : "Your finance information could not be loaded."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const periodsById = useMemo(() => new Map((data?.membershipPeriods ?? []).map(period => [period.id, period])), [data]);
  const currentPeriod = data?.membershipPeriods.find(period => period.status === "ACTIVE") ?? data?.membershipPeriods[0];

  const titles: Record<FinanceView, [string, string]> = {
    overview: ["Finance Overview", "Your current KUHRSA financial position, membership charges, payments and receipts."],
    fees: ["Membership Fees", "Charges and fee schedules recorded against your membership account."],
    payment: ["Make Payment", "Review your outstanding amount and the available payment process."],
    history: ["Payment History", "Payments recorded against your own KUHRSA member account."],
    balance: ["Outstanding Balance", "Your current outstanding charges, excluding waived and cancelled items."],
    receipts: ["Receipts", "Receipts issued for payments recorded against your membership."],
    statements: ["Statements", "A consolidated view of charges, payments and balances by membership period."],
  };

  return <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <Header title={titles[view][0]} description={titles[view][1]} />
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3">
      <div className="text-xs text-black/50">{data ? <>Member account <strong className="text-[#0B2633]">{data.member.memberNumber}</strong> · {data.member.category}</> : "Member finance account"}</div>
      <button type="button" onClick={() => void load()} disabled={loading} className="rounded-lg border border-black/10 px-3 py-2 text-xs font-bold text-[#0B2633] disabled:opacity-40">{loading ? "Refreshing…" : "Refresh records"}</button>
    </div>
    {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"><p className="font-bold">Finance data unavailable</p><p className="mt-1">{error}</p><button type="button" onClick={() => void load()} className="mt-3 rounded-lg border border-rose-300 px-3 py-2 text-xs font-bold">Try again</button></div> : null}
    {loading && !data ? <div className="mt-6 rounded-2xl bg-white p-8 text-sm text-black/45">Loading your finance records…</div> : null}
    {!loading && !error && data ? <>
      {view === "overview" ? <>
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Tile label="Outstanding Balance" value={money(data.summary.outstandingBalance)} />
          <Tile label="Total Charges" value={money(data.summary.totalCharged)} />
          <Tile label="Allocated Payments" value={money(data.summary.allocatedPaid)} />
          <Tile label="Member Status" value={data.member.status.replaceAll("_", " ")} />
        </section>
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">Membership Cycle</p><h2 className="mt-2 text-xl font-black text-[#0B2633]">{currentPeriod?.membershipYear ?? "No membership period recorded"}</h2>{currentPeriod ? <div className="mt-4 grid gap-3 sm:grid-cols-2"><Tile label="Starts" value={date(currentPeriod.startsAt)} /><Tile label="Ends" value={date(currentPeriod.endsAt)} /><Tile label="Period Status" value={currentPeriod.status} /><Tile label="Financial Status" value={data.member.financialStatus.replaceAll("_", " ")} /></div> : null}</div>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">Finance Services</p><div className="mt-4 grid gap-2">{[["/dashboard/finance/fees","Membership Fees"],["/dashboard/finance/payment","Make Payment"],["/dashboard/finance/history","Payment History"],["/dashboard/finance/receipts","Receipts"],["/dashboard/finance/statements","Statements"]].map(([href,label])=><Link key={href} href={href} className="rounded-xl border border-black/[0.06] px-4 py-3 text-sm font-bold text-[#0B2633] hover:bg-[#168DB8]/5">{label} →</Link>)}</div></div>
        </section>
      </> : null}

      {view === "fees" ? <section className="mt-6 overflow-x-auto rounded-2xl border border-black/[0.06] bg-white p-5"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b text-[10px] uppercase tracking-wider text-black/40">{["Fee","Membership period","Amount","Paid","Balance","Status"].map(x=><th key={x} className="px-3 py-3">{x}</th>)}</tr></thead><tbody>{data.charges.map(charge=><tr key={charge.id} className="border-b border-black/[0.04] text-sm"><td className="px-3 py-4 font-bold text-[#0B2633]">{charge.feeSchedule?.feeDefinition?.name ?? charge.description ?? "Membership charge"}<p className="text-xs font-normal text-black/40">{charge.feeSchedule?.feeDefinition?.code ?? ""}</p></td><td className="px-3 py-4 text-black/55">{charge.membershipPeriod?.membershipYear ?? "—"}</td><td className="px-3 py-4">{money(charge.amountDue, charge.currency)}</td><td className="px-3 py-4">{money(charge.amountPaid, charge.currency)}</td><td className="px-3 py-4 font-bold">{money(charge.balance, charge.currency)}</td><td className="px-3 py-4"><Status value={charge.status} /></td></tr>)}</tbody></table>{data.charges.length===0 ? <Empty>No charges have been recorded for your account.</Empty> : null}</section> : null}

      {view === "balance" ? <section className="mt-6 rounded-3xl bg-[#0B2633] p-8 text-white"><p className="text-[10px] font-black uppercase tracking-[0.17em] text-white/45">Outstanding Balance</p><p className="mt-3 text-5xl font-black">{money(data.summary.outstandingBalance)}</p><p className="mt-3 text-sm text-white/60">Based on your current unpaid and partially paid charges.</p><div className="mt-7 space-y-3">{data.charges.filter(c=>Number(c.balance)>0 && !["WAIVED","CANCELLED"].includes(c.status)).map(c=><div key={c.id} className="flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 text-sm"><span>{c.feeSchedule?.feeDefinition?.name ?? c.description ?? "Membership charge"}</span><strong>{money(c.balance,c.currency)}</strong></div>)}</div></section> : null}

      {view === "history" ? <section className="mt-6 overflow-x-auto rounded-2xl border border-black/[0.06] bg-white p-5"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b text-[10px] uppercase tracking-wider text-black/40">{["Reference","Date","Description","Method","Amount","Status"].map(x=><th key={x} className="px-3 py-3">{x}</th>)}</tr></thead><tbody>{data.payments.map(payment=><tr key={payment.id} className="border-b border-black/[0.04] text-sm"><td className="px-3 py-4 font-bold">{payment.reference ?? payment.externalReference ?? payment.id.slice(0,8)}</td><td className="px-3 py-4 text-black/55">{date(payment.paidAt ?? payment.createdAt)}</td><td className="px-3 py-4 text-black/55">{payment.description ?? "Membership payment"}</td><td className="px-3 py-4 text-black/55">{payment.method.replaceAll("_"," ")}</td><td className="px-3 py-4 font-bold">{money(payment.amount,payment.currency)}</td><td className="px-3 py-4"><Status value={payment.status} /></td></tr>)}</tbody></table>{data.payments.length===0 ? <Empty>No payments have been recorded for your account.</Empty> : null}</section> : null}

      {view === "receipts" ? <section className="mt-6 grid gap-4">{data.receipts.map(receipt=><article key={receipt.id} className="rounded-2xl border border-black/[0.06] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">{receipt.receiptNumber}</p><p className="mt-2 text-xs text-black/45">Issued {date(receipt.issuedAt)} · {receipt.payment?.method ?? "Payment"}</p>{receipt.voidReason ? <p className="mt-2 text-xs text-rose-700">Void reason: {receipt.voidReason}</p> : null}</div><div className="text-right"><p className="text-xl font-black text-[#0B2633]">{money(receipt.amount,receipt.currency)}</p><Status value={receipt.status} /></div></div></article>)}{data.receipts.length===0 ? <Empty>No receipts have been issued for your account.</Empty> : null}</section> : null}

      {view === "statements" ? <section className="mt-6 space-y-4">{data.membershipPeriods.map(period=>{const charges=data.charges.filter(c=>c.membershipPeriod?.id===period.id);const chargeTotal=charges.reduce((n,c)=>n+Number(c.amountDue),0);const paid=charges.reduce((n,c)=>n+Number(c.amountPaid),0);return <article key={period.id} className="rounded-2xl border border-black/[0.06] bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-black text-[#0B2633]">{period.membershipYear}</h2><p className="text-xs text-black/45">{date(period.startsAt)} – {date(period.endsAt)}</p></div><Status value={period.status} /></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Tile label="Charges" value={money(chargeTotal)} /><Tile label="Paid / Allocated" value={money(paid)} /><Tile label="Closing Balance" value={money(charges.reduce((n,c)=>n+Number(c.balance),0))} /></div></article>})}{data.membershipPeriods.length===0 ? <Empty>No membership periods are available for statements.</Empty> : null}</section> : null}

      {view === "payment" ? <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]"><div className="rounded-2xl border border-black/[0.06] bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">Amount currently outstanding</p><p className="mt-3 text-4xl font-black text-[#0B2633]">{money(data.summary.outstandingBalance)}</p><p className="mt-3 text-sm leading-6 text-black/50">This amount is calculated from charges recorded against your own member account. Payment initiation is being connected to the member-safe M-Pesa flow; this screen does not mark payments as received.</p></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">Payment initiation not yet enabled</p><p className="mt-3 text-sm leading-6 text-amber-900/75">The existing M-Pesa initiation endpoint is restricted to finance staff. A member-scoped STK endpoint with amount and ownership validation is the next integration step. No payment is taken from this screen yet.</p></div></section> : null}
    </> : null}
  </div>;
}
