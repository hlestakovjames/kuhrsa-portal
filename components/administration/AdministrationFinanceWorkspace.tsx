"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getToken, logout } from "@/lib/auth";

type FinanceView =
  | "dashboard" | "fees" | "payments" | "history" | "mpesa"
  | "reconciliation" | "receipts" | "refunds" | "expenses"
  | "budgets" | "ledger" | "reports";

type Props = { view: FinanceView };

type MemberRecord = {
  id?: string;
  memberNumber?: string | null;
  registrationNumber?: string | null;
  user?: {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
  } | null;
};

type PaymentRecord = {
  id: string;
  amount: string | number;
  currency?: string;
  method: string;
  status: string;
  reference?: string | null;
  externalReference?: string | null;
  description?: string | null;
  createdAt: string;
  paidAt?: string | null;
  member?: MemberRecord | null;
  allocations?: Array<{ id: string; amount: string | number }>;
  receipt?: { id: string; receiptNumber: string; status: string } | null;
  mpesaTransaction?: {
    phoneNumber?: string | null;
    merchantRequestId?: string | null;
    checkoutRequestId?: string | null;
    resultCode?: string | null;
    resultDescription?: string | null;
  } | null;
};

type FeeSchedule = {
  id: string;
  name: string;
  amount: string | number;
  currency: string;
  status: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  memberCategory?: string | null;
  constitutionalCategory?: string | null;
};

type FeeDefinition = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  type: string;
  isActive: boolean;
  schedules?: FeeSchedule[];
};

type ReceiptRecord = {
  id: string;
  receiptNumber: string;
  amount: string | number;
  currency: string;
  status: string;
  issuedAt: string;
  member?: MemberRecord | null;
  payment?: PaymentRecord | null;
};

type DashboardSummary = {
  finance: {
    outstandingBalance: string;
    completedPaymentsAmount: string;
    overdueCharges: number;
    pendingPayments: number;
    failedPayments: number;
    cancelledPayments: number;
  };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ??
  "http://localhost:3001";

async function apiRequest<T>(path: string): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    logout();
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;
    throw new Error(message || "The finance data could not be loaded.");
  }
  return data as T;
}

function formatCurrency(value: string | number, currency = "KES") {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium" }).format(date);
}

function formatStatus(value?: string | null) {
  return (value ?? "Unknown")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function memberLabel(member?: MemberRecord | null) {
  if (!member) return "Member not linked";
  const name = [
    member.user?.firstName,
    member.user?.middleName,
    member.user?.lastName,
  ].filter((part): part is string => Boolean(part?.trim())).join(" ").trim();
  return name || member.memberNumber || member.registrationNumber || "Member record";
}

function memberNumber(member?: MemberRecord | null) {
  return member?.memberNumber || member?.registrationNumber || "Number unavailable";
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#CE26A4]">Finance & Payments</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633]">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">{description}</p>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_20px_rgba(11,38,51,0.03)]">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">{value}</p>
    </div>
  );
}

function StatePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-7 ring-1 ring-black/[0.06]">
      <h2 className="text-sm font-black text-[#0B2633]">{title}</h2>
      <div className="mt-2 text-sm leading-6 text-black/50">{children}</div>
    </section>
  );
}

function LoadingState() {
  return <StatePanel title="Loading finance records">Retrieving current records from the KUHRSA backend…</StatePanel>;
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
      <p className="text-sm font-black text-rose-800">Unable to load finance data</p>
      <p className="mt-2 text-sm text-rose-700">{message}</p>
      <button type="button" onClick={retry} className="mt-4 rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white">Try Again</button>
    </section>
  );
}

function Badge({ value }: { value: string }) {
  const positive = ["COMPLETED", "ISSUED", "ACTIVE"].includes(value);
  const attention = ["PENDING", "PROCESSING", "PARTIALLY_PAID", "OVERDUE"].includes(value);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${positive ? "bg-emerald-50 text-emerald-700" : attention ? "bg-amber-50 text-amber-700" : "bg-black/[0.05] text-black/50"}`}>
      {formatStatus(value)}
    </span>
  );
}

function PaymentsTable({ title, records }: { title: string; records: PaymentRecord[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div className="mb-5">
        <h2 className="text-lg font-black text-[#0B2633]">{title}</h2>
        <p className="mt-1 text-sm text-black/40">Live payment records returned by the KUHRSA finance API.</p>
      </div>
      {records.length === 0 ? (
        <p className="rounded-2xl bg-[#F8FBFC] p-5 text-sm text-black/45">No payment records are currently available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead><tr className="border-b border-black/[0.06]">
              {["Reference", "Member", "Member Number", "Amount", "Method", "Date", "Status"].map((item) => <th key={item} className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0">{item}</th>)}
            </tr></thead>
            <tbody>{records.map((item) => (
              <tr key={item.id} className="border-b border-black/[0.05] last:border-0">
                <td className="px-3 py-4 text-xs font-black text-[#CE26A4] first:pl-0">{item.reference || item.externalReference || item.id.slice(0, 8)}</td>
                <td className="px-3 py-4 text-xs font-semibold text-black/60">{memberLabel(item.member)}</td>
                <td className="px-3 py-4 text-xs text-black/50">{memberNumber(item.member)}</td>
                <td className="px-3 py-4 text-sm font-black text-[#0B2633]">{formatCurrency(item.amount, item.currency)}</td>
                <td className="px-3 py-4 text-xs text-black/55">{formatStatus(item.method)}</td>
                <td className="px-3 py-4 text-xs text-black/55">{formatDate(item.paidAt || item.createdAt)}</td>
                <td className="px-3 py-4"><Badge value={item.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function UnavailableView({ view }: { view: FinanceView }) {
  const content: Record<string, { title: string; description: string }> = {
    reconciliation: {
      title: "Reconciliation workflow is not connected",
      description: "The backend stores M-Pesa transactions, payments and allocations, but a dedicated matching, exception-review and reconciliation workflow is not yet available. No synthetic matched/unmatched results or inactive Review controls are shown.",
    },
    refunds: {
      title: "Refund management is not available",
      description: "The inspected backend does not expose a complete refund request, approval and execution workflow. This screen will remain unavailable until that workflow is designed and implemented.",
    },
    expenses: {
      title: "Expense management is not available",
      description: "No expense records or expense approval API were found in the current backend implementation.",
    },
    budgets: {
      title: "Budget management is not available",
      description: "No persisted budget model or budget management API was found in the current backend implementation.",
    },
    ledger: {
      title: "General ledger is not available",
      description: "Payment and allocation records exist, but a general ledger and journal-entry workflow were not found. Transaction rows must not be presented as a balanced ledger.",
    },
    reports: {
      title: "Financial reports are available through Reports",
      description: "Use Reports & Analytics for the existing organization-scoped CSV/XLSX payment, charge and receipt exports. Dedicated expense, budget, reconciliation and ledger reports are not yet supported.",
    },
  };
  const item = content[view];
  return <div className="space-y-6"><Header title={item.title} description={item.description} /><StatePanel title="Backend capability status">This view is intentionally read-only and unavailable until the corresponding backend workflow exists.</StatePanel></div>;
}

export default function AdministrationFinanceWorkspace({ view }: Props) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [fees, setFees] = useState<FeeDefinition[]>([]);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (view === "dashboard") {
        const [dashboard, paymentRows] = await Promise.all([
          apiRequest<DashboardSummary>("/dashboard/administration"),
          apiRequest<PaymentRecord[]>("/finance/payments"),
        ]);
        setSummary(dashboard);
        setPayments(paymentRows.slice(0, 8));
      } else if (view === "fees") {
        setFees(await apiRequest<FeeDefinition[]>("/finance/fees"));
      } else if (view === "payments" || view === "history" || view === "mpesa") {
        setPayments(await apiRequest<PaymentRecord[]>("/finance/payments"));
      } else if (view === "receipts") {
        setReceipts(await apiRequest<ReceiptRecord[]>("/finance/receipts"));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The finance data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => { void load(); }, [load]);

  const mpesaPayments = useMemo(
    () => payments.filter((item) => item.method === "MPESA"),
    [payments],
  );

  if (["reconciliation", "refunds", "expenses", "budgets", "ledger", "reports"].includes(view)) {
    return <UnavailableView view={view} />;
  }
  if (loading) return <div className="space-y-6"><Header title="Finance & Payments" description="Live finance information from the KUHRSA backend." /><LoadingState /></div>;
  if (error) return <div className="space-y-6"><Header title="Finance & Payments" description="Organization-scoped finance records." /><ErrorState message={error} retry={() => void load()} /></div>;

  if (view === "fees") {
    return (
      <div className="space-y-6">
        <Header title="Membership Fees" description="Fee definitions and effective schedules currently stored by the KUHRSA backend. This view is read-only." />
        {fees.length === 0 ? <StatePanel title="No fee definitions">No fee definitions have been configured for this organization.</StatePanel> : fees.map((fee) => (
          <section key={fee.id} className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-wider text-[#CE26A4]">{fee.code} · {formatStatus(fee.type)}</p><h2 className="mt-2 text-xl font-black text-[#0B2633]">{fee.name}</h2>{fee.description ? <p className="mt-1 text-sm text-black/45">{fee.description}</p> : null}</div>
              <Badge value={fee.isActive ? "ACTIVE" : "INACTIVE"} />
            </div>
            <div className="mt-5 space-y-3">
              {(fee.schedules ?? []).length === 0 ? <p className="rounded-xl bg-[#F8FBFC] p-4 text-sm text-black/45">No fee schedules are attached to this definition.</p> : fee.schedules?.map((schedule) => (
                <div key={schedule.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F8FBFC] p-4">
                  <div><p className="text-sm font-bold text-[#0B2633]">{schedule.name}</p><p className="mt-1 text-xs text-black/45">{schedule.memberCategory ? formatStatus(schedule.memberCategory) : "All member categories"} · Effective {formatDate(schedule.effectiveFrom)}{schedule.effectiveTo ? ` – ${formatDate(schedule.effectiveTo)}` : " onward"}</p></div>
                  <div className="flex items-center gap-3"><p className="text-sm font-black text-[#0B2633]">{formatCurrency(schedule.amount, schedule.currency)}</p><Badge value={schedule.status} /></div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (view === "payments" || view === "history") {
    return <div className="space-y-6"><Header title={view === "history" ? "Payment History" : "Payments"} description="Live organization-scoped payment transactions from the finance API." /><PaymentsTable title={view === "history" ? "Payment History" : "Payment Register"} records={payments} /></div>;
  }

  if (view === "mpesa") {
    return <div className="space-y-6"><Header title="M-Pesa Transactions" description="M-Pesa payment records and provider transaction references returned by the KUHRSA backend. This is a read-only transaction view, not a reconciliation tool." /><section className="grid gap-4 sm:grid-cols-3"><StatCard label="M-Pesa Transactions" value={mpesaPayments.length} /><StatCard label="Completed" value={mpesaPayments.filter((item) => item.status === "COMPLETED").length} /><StatCard label="Pending / Processing" value={mpesaPayments.filter((item) => ["PENDING", "PROCESSING"].includes(item.status)).length} /></section><PaymentsTable title="M-Pesa Payment Register" records={mpesaPayments} />{mpesaPayments.length > 0 ? <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"><h2 className="text-lg font-black text-[#0B2633]">Provider references</h2><div className="mt-4 space-y-3">{mpesaPayments.map((item) => <div key={item.id} className="rounded-2xl bg-[#F8FBFC] p-4"><p className="text-sm font-bold text-[#0B2633]">{item.reference || item.id}</p><p className="mt-1 text-xs text-black/45">Checkout: {item.mpesaTransaction?.checkoutRequestId || "Not available"} · Merchant: {item.mpesaTransaction?.merchantRequestId || "Not available"}</p><p className="mt-1 text-xs text-black/45">Phone: {item.mpesaTransaction?.phoneNumber || "Not available"} · Result: {item.mpesaTransaction?.resultDescription || "No callback result recorded"}</p></div>)}</div></section> : null}</div>;
  }

  if (view === "receipts") {
    return <div className="space-y-6"><Header title="Receipts" description="Issued receipt records returned by the KUHRSA backend. Receipt issuance and voiding remain permission-controlled backend operations." /><section className="grid gap-4 sm:grid-cols-3"><StatCard label="Receipts" value={receipts.length} /><StatCard label="Issued" value={receipts.filter((item) => item.status === "ISSUED").length} /><StatCard label="Voided" value={receipts.filter((item) => item.status === "VOIDED").length} /></section><section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"><div className="overflow-x-auto"><table className="min-w-full text-left"><thead><tr className="border-b border-black/[0.06]">{["Receipt", "Member", "Member Number", "Payment", "Amount", "Issued", "Status"].map((item) => <th key={item} className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-black/35 first:pl-0">{item}</th>)}</tr></thead><tbody>{receipts.map((item) => <tr key={item.id} className="border-b border-black/[0.05] last:border-0"><td className="px-3 py-4 text-xs font-black text-[#CE26A4] first:pl-0">{item.receiptNumber}</td><td className="px-3 py-4 text-xs text-black/60">{memberLabel(item.member)}</td><td className="px-3 py-4 text-xs text-black/50">{memberNumber(item.member)}</td><td className="px-3 py-4 text-xs text-black/50">{item.payment?.reference || item.payment?.id || "—"}</td><td className="px-3 py-4 text-sm font-black text-[#0B2633]">{formatCurrency(item.amount, item.currency)}</td><td className="px-3 py-4 text-xs text-black/50">{formatDate(item.issuedAt)}</td><td className="px-3 py-4"><Badge value={item.status} /></td></tr>)}</tbody></table></div>{receipts.length === 0 ? <p className="py-5 text-sm text-black/45">No receipt records are currently available.</p> : null}</section></div>;
  }

  const finance = summary?.finance;
  return (
    <div className="space-y-6">
      <Header title="Finance Dashboard" description="Live financial totals from the organization-scoped administration dashboard and recent payment records." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Completed Collections" value={formatCurrency(finance?.completedPaymentsAmount ?? 0)} />
        <StatCard label="Outstanding Charges" value={formatCurrency(finance?.outstandingBalance ?? 0)} />
        <StatCard label="Overdue Charges" value={finance?.overdueCharges ?? 0} />
        <StatCard label="Pending Payments" value={finance?.pendingPayments ?? 0} />
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Failed Payments" value={finance?.failedPayments ?? 0} />
        <StatCard label="Cancelled Payments" value={finance?.cancelledPayments ?? 0} />
        <StatCard label="Recent Transactions Loaded" value={payments.length} />
      </section>
      <PaymentsTable title="Recent Payments" records={payments} />
    </div>
  );
}
