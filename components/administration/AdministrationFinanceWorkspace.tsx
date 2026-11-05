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
  allocations?: Array<{ id: string; chargeId: string; amount: string | number }>;
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

type ChargeRecord = {
  id: string;
  memberId: string;
  member?: MemberRecord | null;
  amountDue: string | number;
  amountPaid: string | number;
  balance: string | number;
  currency: string;
  status: string;
  description?: string | null;
  dueDate?: string | null;
  feeSchedule?: { name?: string; feeDefinition?: { name?: string } } | null;
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

async function apiWrite<T>(path: string, method: "POST" | "PATCH", body: unknown): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (response.status === 401) {
    logout();
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    throw new Error(message || "The finance configuration could not be saved.");
  }
  return data as T;
}

async function apiMutation<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (response.status === 401) {
    logout();
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    throw new Error(message || "The finance action could not be completed.");
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

function ChargesTable({ records }: { records: ChargeRecord[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div className="mb-5">
        <h2 className="text-lg font-black text-[#0B2633]">Member charge register</h2>
        <p className="mt-1 text-sm text-black/40">Live charge records, including the linked member name and member number.</p>
      </div>
      {records.length === 0 ? <p className="rounded-2xl bg-[#F8FBFC] p-5 text-sm text-black/45">No member charges are currently available.</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead><tr className="border-b border-black/[0.06]">{["Member", "Member Number", "Fee", "Amount Due", "Paid", "Balance", "Due Date", "Status"].map((item) => <th key={item} className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0">{item}</th>)}</tr></thead>
            <tbody>{records.map((charge) => (
              <tr key={charge.id} className="border-b border-black/[0.05] last:border-0">
                <td className="px-3 py-4 text-xs font-semibold text-black/60 first:pl-0">{memberLabel(charge.member)}</td>
                <td className="px-3 py-4 text-xs text-black/50">{memberNumber(charge.member)}</td>
                <td className="px-3 py-4 text-xs text-black/55">{charge.feeSchedule?.feeDefinition?.name || charge.feeSchedule?.name || charge.description || "Member charge"}</td>
                <td className="px-3 py-4 text-xs font-bold text-[#0B2633]">{formatCurrency(charge.amountDue, charge.currency)}</td>
                <td className="px-3 py-4 text-xs text-black/55">{formatCurrency(charge.amountPaid, charge.currency)}</td>
                <td className="px-3 py-4 text-xs font-black text-[#0B2633]">{formatCurrency(charge.balance, charge.currency)}</td>
                <td className="px-3 py-4 text-xs text-black/50">{formatDate(charge.dueDate)}</td>
                <td className="px-3 py-4"><Badge value={charge.status} /></td>
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
  const [feeCode, setFeeCode] = useState("");
  const [feeName, setFeeName] = useState("");
  const [feeDescription, setFeeDescription] = useState("");
  const [feeType, setFeeType] = useState("ANNUAL_MEMBERSHIP");
  const [scheduleFeeId, setScheduleFeeId] = useState("");
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleAmount, setScheduleAmount] = useState("");
  const [scheduleStatus, setScheduleStatus] = useState("DRAFT");
  const [scheduleFrom, setScheduleFrom] = useState("");
  const [scheduleTo, setScheduleTo] = useState("");
  const [scheduleMemberCategory, setScheduleMemberCategory] = useState("");
  const [scheduleConstitutionalCategory, setScheduleConstitutionalCategory] = useState("");
  const [feeSaving, setFeeSaving] = useState(false);
  const [feeActionError, setFeeActionError] = useState<string | null>(null);
  const [feeActionSuccess, setFeeActionSuccess] = useState<string | null>(null);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editFeeName, setEditFeeName] = useState("");
  const [editFeeDescription, setEditFeeDescription] = useState("");
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [editScheduleName, setEditScheduleName] = useState("");
  const [editScheduleAmount, setEditScheduleAmount] = useState("");
  const [editScheduleStatus, setEditScheduleStatus] = useState("DRAFT");
  const [editScheduleFrom, setEditScheduleFrom] = useState("");
  const [editScheduleTo, setEditScheduleTo] = useState("");
  const [editScheduleMemberCategory, setEditScheduleMemberCategory] = useState("");
  const [editScheduleConstitutionalCategory, setEditScheduleConstitutionalCategory] = useState("");
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [charges, setCharges] = useState<ChargeRecord[]>([]);
  const [chargeMembers, setChargeMembers] = useState<MemberRecord[]>([]);
  const [chargeFees, setChargeFees] = useState<FeeDefinition[]>([]);
  const [chargeMemberId, setChargeMemberId] = useState("");
  const [chargeScheduleId, setChargeScheduleId] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeDescription, setChargeDescription] = useState("");
  const [chargeDueDate, setChargeDueDate] = useState("");
  const [chargeSaving, setChargeSaving] = useState(false);
  const [chargeError, setChargeError] = useState<string | null>(null);
  const [chargeSuccess, setChargeSuccess] = useState<string | null>(null);
  const [chargeSourceWarning, setChargeSourceWarning] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [selectedChargeId, setSelectedChargeId] = useState("");
  const [allocationAmount, setAllocationAmount] = useState("");
  const [allocationError, setAllocationError] = useState<string | null>(null);
  const [allocationSuccess, setAllocationSuccess] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
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
      } else if (view === "reconciliation") {
        const [paymentRows, chargeRows] = await Promise.all([
          apiRequest<PaymentRecord[]>("/finance/payments"),
          apiRequest<ChargeRecord[]>("/finance/charges"),
        ]);
        setPayments(paymentRows);
        setCharges(chargeRows);
        const [memberResult, feeResult] = await Promise.allSettled([
          apiRequest<MemberRecord[]>("/members"),
          apiRequest<FeeDefinition[]>("/finance/fees"),
        ]);
        if (memberResult.status === "fulfilled") {
          setChargeMembers(memberResult.value);
        } else {
          setChargeSourceWarning("Member records could not be loaded; charge creation is unavailable.");
        }
        if (feeResult.status === "fulfilled") {
          setChargeFees(feeResult.value);
        } else {
          setChargeSourceWarning("Fee schedules could not be loaded; charge creation is unavailable.");
        }
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
  const completedPayments = useMemo(
    () => payments.filter((item) => item.status === "COMPLETED"),
    [payments],
  );
  const selectedPayment = payments.find((item) => item.id === selectedPaymentId);
  const allocatableCharges = charges.filter((charge) =>
    selectedPayment &&
    charge.memberId === selectedPayment.member?.id &&
    Number(charge.balance) > 0 &&
    !["CANCELLED", "WAIVED"].includes(charge.status) &&
    charge.currency === selectedPayment.currency &&
    !(selectedPayment.allocations ?? []).some((allocation) => allocation.chargeId === charge.id),
  );

  async function submitFeeDefinition(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeeSaving(true);
    setFeeActionError(null);
    setFeeActionSuccess(null);
    try {
      await apiWrite("/finance/fees", "POST", {
        code: feeCode.trim(),
        name: feeName.trim(),
        description: feeDescription.trim() || undefined,
        type: feeType,
        isActive: true,
      });
      setFeeCode("");
      setFeeName("");
      setFeeDescription("");
      setFeeActionSuccess("Fee definition created.");
      await load();
    } catch (actionError) {
      setFeeActionError(actionError instanceof Error ? actionError.message : "The fee definition could not be created.");
    } finally {
      setFeeSaving(false);
    }
  }

  async function submitFeeSchedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!scheduleFeeId) return;
    setFeeSaving(true);
    setFeeActionError(null);
    setFeeActionSuccess(null);
    try {
      await apiWrite(`/finance/fees/${encodeURIComponent(scheduleFeeId)}/schedules`, "POST", {
        name: scheduleName.trim(),
        amount: Number(scheduleAmount),
        currency: "KES",
        status: scheduleStatus,
        effectiveFrom: scheduleFrom,
        ...(scheduleTo ? { effectiveTo: scheduleTo } : {}),
        ...(scheduleMemberCategory ? { memberCategory: scheduleMemberCategory } : {}),
        ...(scheduleConstitutionalCategory ? { constitutionalCategory: scheduleConstitutionalCategory } : {}),
      });
      setScheduleName("");
      setScheduleAmount("");
      setScheduleTo("");
      setFeeActionSuccess("Fee schedule created. The backend checked date validity and overlapping applicability.");
      await load();
    } catch (actionError) {
      setFeeActionError(actionError instanceof Error ? actionError.message : "The fee schedule could not be created.");
    } finally {
      setFeeSaving(false);
    }
  }

  function beginFeeEdit(fee: FeeDefinition) {
    setEditingFeeId(fee.id);
    setEditFeeName(fee.name);
    setEditFeeDescription(fee.description ?? "");
    setFeeActionError(null);
    setFeeActionSuccess(null);
  }

  async function saveFeeDefinition(fee: FeeDefinition) {
    setFeeSaving(true);
    setFeeActionError(null);
    setFeeActionSuccess(null);
    try {
      await apiWrite(`/finance/fees/${encodeURIComponent(fee.id)}`, "PATCH", {
        name: editFeeName.trim(),
        description: editFeeDescription.trim(),
      });
      setEditingFeeId(null);
      setFeeActionSuccess("Fee definition updated.");
      await load();
    } catch (actionError) {
      setFeeActionError(actionError instanceof Error ? actionError.message : "The fee definition could not be updated.");
    } finally {
      setFeeSaving(false);
    }
  }

  function beginScheduleEdit(schedule: FeeSchedule) {
    setEditingScheduleId(schedule.id);
    setEditScheduleName(schedule.name);
    setEditScheduleAmount(String(schedule.amount));
    setEditScheduleStatus(schedule.status);
    setEditScheduleFrom(schedule.effectiveFrom.slice(0, 10));
    setEditScheduleTo(schedule.effectiveTo?.slice(0, 10) ?? "");
    setEditScheduleMemberCategory(schedule.memberCategory ?? "");
    setEditScheduleConstitutionalCategory(schedule.constitutionalCategory ?? "");
    setFeeActionError(null);
    setFeeActionSuccess(null);
  }

  async function saveFeeSchedule(schedule: FeeSchedule) {
    setFeeSaving(true);
    setFeeActionError(null);
    setFeeActionSuccess(null);
    try {
      await apiWrite(`/finance/fees/${encodeURIComponent(schedule.id)}/schedules`, "PATCH", {
        name: editScheduleName.trim(),
        amount: Number(editScheduleAmount),
        status: editScheduleStatus,
        effectiveFrom: editScheduleFrom,
        ...(editScheduleTo ? { effectiveTo: editScheduleTo } : {}),
        ...(editScheduleMemberCategory ? { memberCategory: editScheduleMemberCategory } : {}),
        ...(editScheduleConstitutionalCategory ? { constitutionalCategory: editScheduleConstitutionalCategory } : {}),
      });
      setEditingScheduleId(null);
      setFeeActionSuccess("Fee schedule updated. The backend rechecked date validity and overlapping applicability.");
      await load();
    } catch (actionError) {
      setFeeActionError(actionError instanceof Error ? actionError.message : "The fee schedule could not be updated.");
    } finally {
      setFeeSaving(false);
    }
  }

  async function toggleFeeDefinition(fee: FeeDefinition) {
    setFeeSaving(true);
    setFeeActionError(null);
    setFeeActionSuccess(null);
    try {
      await apiWrite(`/finance/fees/${encodeURIComponent(fee.id)}/${fee.isActive ? "deactivate" : "activate"}`, "POST", {});
      setFeeActionSuccess(`Fee definition ${fee.isActive ? "deactivated" : "activated"}.`);
      await load();
    } catch (actionError) {
      setFeeActionError(actionError instanceof Error ? actionError.message : "The fee definition status could not be changed.");
    } finally {
      setFeeSaving(false);
    }
  }

  async function submitAllocation() {
    if (!selectedPaymentId || !selectedChargeId || !allocationAmount) {
      setAllocationError("Select a completed payment, an outstanding charge and an allocation amount.");
      return;
    }
    const amount = Number(allocationAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setAllocationError("Enter an allocation amount greater than zero.");
      return;
    }
    setAllocating(true);
    setAllocationError(null);
    setAllocationSuccess(null);
    try {
      await apiMutation(
        `/finance/allocations?paymentId=${encodeURIComponent(selectedPaymentId)}`,
        { chargeId: selectedChargeId, amount },
      );
      setAllocationSuccess("Payment allocation saved. The charge balance has been recalculated by the backend.");
      setSelectedChargeId("");
      setAllocationAmount("");
      await load();
    } catch (actionError) {
      setAllocationError(actionError instanceof Error ? actionError.message : "The allocation could not be saved.");
    } finally {
      setAllocating(false);
    }
  }

  if (["refunds", "expenses", "budgets", "ledger", "reports"].includes(view)) {
    return <UnavailableView view={view} />;
  }
  if (loading) return <div className="space-y-6"><Header title="Finance & Payments" description="Live finance information from the KUHRSA backend." /><LoadingState /></div>;
  if (error) return <div className="space-y-6"><Header title="Finance & Payments" description="Organization-scoped finance records." /><ErrorState message={error} retry={() => void load()} /></div>;

  if (view === "reconciliation") {
    return (
      <div className="space-y-6">
        <Header
          title="Payment Allocation & Reconciliation"
          description="Review completed payments and allocate them to outstanding charges belonging to the same member. The backend validates ownership, currency, payment completion and remaining balances."
        />
        <StatePanel title="Scope of this workflow">
          This connects the existing payment-allocation API. It allocates already-recorded completed payments to member charges; it does not independently match bank statements, verify M-Pesa callbacks or approve unverified transactions.
        </StatePanel>
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Completed Payments" value={completedPayments.length} />
          <StatCard label="Outstanding Charges" value={charges.filter((item) => Number(item.balance) > 0 && !["CANCELLED", "WAIVED"].includes(item.status)).length} />
          <StatCard label="Allocations Recorded" value={payments.reduce((total, item) => total + (item.allocations?.length ?? 0), 0)} />
        </section>
        <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">Allocate a completed payment</h2>
          <p className="mt-1 text-sm text-black/45">Only eligible charges for the selected payment's member and currency are offered.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="block text-xs font-bold text-black/60">
              Completed payment
              <select value={selectedPaymentId} onChange={(event) => { setSelectedPaymentId(event.target.value); setSelectedChargeId(""); }} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-[#0B2633]">
                <option value="">Select payment</option>
                {completedPayments.map((payment) => {
                  const allocated = (payment.allocations ?? []).reduce((sum, item) => sum + Number(item.amount), 0);
                  const remaining = Number(payment.amount) - allocated;
                  return remaining > 0 ? <option key={payment.id} value={payment.id}>{payment.reference || payment.id.slice(0, 8)} · {memberNumber(payment.member)} · {formatCurrency(remaining, payment.currency)} remaining</option> : null;
                })}
              </select>
            </label>
            <label className="block text-xs font-bold text-black/60">
              Outstanding charge
              <select value={selectedChargeId} onChange={(event) => setSelectedChargeId(event.target.value)} disabled={!selectedPaymentId} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-[#0B2633] disabled:bg-black/[0.03]">
                <option value="">Select charge</option>
                {allocatableCharges.map((charge) => <option key={charge.id} value={charge.id}>{charge.feeSchedule?.feeDefinition?.name || charge.feeSchedule?.name || charge.description || "Member charge"} · {formatCurrency(charge.balance, charge.currency)} due</option>)}
              </select>
            </label>
            <label className="block text-xs font-bold text-black/60">
              Amount to allocate
              <input type="number" min="0.01" step="0.01" value={allocationAmount} onChange={(event) => setAllocationAmount(event.target.value)} disabled={!selectedChargeId} placeholder="e.g. 200.00" className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-[#0B2633] disabled:bg-black/[0.03]" />
            </label>
          </div>
          {selectedPayment ? <p className="mt-3 text-xs text-black/45">Selected payment: {memberLabel(selectedPayment.member)} · {formatCurrency(selectedPayment.amount, selectedPayment.currency)} · {formatStatus(selectedPayment.status)}</p> : null}
          {selectedPaymentId && allocatableCharges.length === 0 ? <p className="mt-3 text-xs text-amber-700">No eligible outstanding charge is available for this payment. Check member ownership, currency, existing allocations and charge status.</p> : null}
          {allocationError ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{allocationError}</p> : null}
          {allocationSuccess ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{allocationSuccess}</p> : null}
          <button type="button" onClick={() => void submitAllocation()} disabled={allocating || !selectedPaymentId || !selectedChargeId || !allocationAmount} className="mt-5 rounded-xl bg-[#0B2633] px-5 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40">{allocating ? "Saving allocation…" : "Save payment allocation"}</button>
        </section>
        <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">Recorded allocations</h2>
          <div className="mt-4 space-y-3">
            {payments.flatMap((payment) => (payment.allocations ?? []).map((allocation) => ({ payment, allocation }))).length === 0 ? <p className="text-sm text-black/45">No payment allocations are currently recorded.</p> : payments.flatMap((payment) => (payment.allocations ?? []).map((allocation) => ({ payment, allocation }))).map(({ payment, allocation }) => (
              <div key={allocation.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F8FBFC] p-4">
                <div><p className="text-sm font-bold text-[#0B2633]">{memberLabel(payment.member)} · {memberNumber(payment.member)}</p><p className="mt-1 text-xs text-black/45">Payment {payment.reference || payment.id.slice(0, 8)}</p></div>
                <p className="text-sm font-black text-[#0B2633]">{formatCurrency(allocation.amount, payment.currency)}</p>
              </div>
            ))}
          </div>
        </section>
        <ChargesTable records={charges} />
      </div>
    );
  }

  if (view === "fees") {
    return (
      <div className="space-y-6">
        <Header title="Membership Fees" description="Manage fee definitions and dated fee schedules using the existing organization-scoped KUHRSA finance APIs. Creating or changing a schedule does not automatically create a member charge." />
        {feeActionError ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{feeActionError}</p> : null}
        {feeActionSuccess ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feeActionSuccess}</p> : null}
        <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">Create fee definition</h2>
          <p className="mt-1 text-sm text-black/45">Define a fee category first. Amounts and effective dates are configured separately in fee schedules.</p>
          <form onSubmit={submitFeeDefinition} className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-bold text-black/60">Code<input required maxLength={50} value={feeCode} onChange={(event) => setFeeCode(event.target.value)} placeholder="e.g. ANNUAL-MEMBERSHIP" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
            <label className="text-xs font-bold text-black/60">Name<input required maxLength={150} value={feeName} onChange={(event) => setFeeName(event.target.value)} placeholder="Fee name" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
            <label className="text-xs font-bold text-black/60">Fee type<select value={feeType} onChange={(event) => setFeeType(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"><option value="ADMISSION">Admission</option><option value="ANNUAL_MEMBERSHIP">Annual membership</option><option value="EVENT">Event</option><option value="ACTIVITY">Activity</option><option value="OTHER">Other</option></select></label>
            <label className="text-xs font-bold text-black/60">Description<input maxLength={500} value={feeDescription} onChange={(event) => setFeeDescription(event.target.value)} placeholder="Optional description" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
            <div className="md:col-span-2"><button disabled={feeSaving} className="rounded-xl bg-[#0B2633] px-5 py-3 text-xs font-black text-white disabled:opacity-50">{feeSaving ? "Saving…" : "Create fee definition"}</button></div>
          </form>
        </section>
        <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">Create fee schedule</h2>
          <p className="mt-1 text-sm text-black/45">Schedules are effective-dated and may be limited by member category or constitutional category. No fee amount is prefilled.</p>
          <form onSubmit={submitFeeSchedule} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="text-xs font-bold text-black/60">Fee definition<select required value={scheduleFeeId} onChange={(event) => setScheduleFeeId(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"><option value="">Select definition</option>{fees.filter((fee) => fee.isActive).map((fee) => <option key={fee.id} value={fee.id}>{fee.code} · {fee.name}</option>)}</select></label>
            <label className="text-xs font-bold text-black/60">Schedule name<input required maxLength={150} value={scheduleName} onChange={(event) => setScheduleName(event.target.value)} placeholder="e.g. 2026/2027 membership" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
            <label className="text-xs font-bold text-black/60">Amount (KES)<input required type="number" min="0" step="0.01" value={scheduleAmount} onChange={(event) => setScheduleAmount(event.target.value)} placeholder="Enter approved amount" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
            <label className="text-xs font-bold text-black/60">Status<select value={scheduleStatus} onChange={(event) => setScheduleStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option></select></label>
            <label className="text-xs font-bold text-black/60">Effective from<input required type="date" value={scheduleFrom} onChange={(event) => setScheduleFrom(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
            <label className="text-xs font-bold text-black/60">Effective to (optional)<input type="date" value={scheduleTo} onChange={(event) => setScheduleTo(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
            <label className="text-xs font-bold text-black/60">Member category<select value={scheduleMemberCategory} onChange={(event) => setScheduleMemberCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"><option value="">All categories</option><option value="STUDENT">Student</option><option value="ALUMNI">Alumni</option><option value="LECTURER">Lecturer</option></select></label>
            <label className="text-xs font-bold text-black/60">Constitutional category<select value={scheduleConstitutionalCategory} onChange={(event) => setScheduleConstitutionalCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"><option value="">All categories</option><option value="ORDINARY">Ordinary</option><option value="ASSOCIATE">Associate</option><option value="ALUMNI">Alumni</option><option value="HONORARY">Honorary</option></select></label>
            <div className="flex items-end"><button disabled={feeSaving || fees.every((fee) => !fee.isActive)} className="rounded-xl bg-[#0B2633] px-5 py-3 text-xs font-black text-white disabled:opacity-50">{feeSaving ? "Saving…" : "Create fee schedule"}</button></div>
          </form>
        </section>
        {fees.length === 0 ? <StatePanel title="No fee definitions">No fee definitions have been configured for this organization.</StatePanel> : fees.map((fee) => (
          <section key={fee.id} className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-wider text-[#CE26A4]">{fee.code} · {formatStatus(fee.type)}</p><h2 className="mt-2 text-xl font-black text-[#0B2633]">{fee.name}</h2>{fee.description ? <p className="mt-1 text-sm text-black/45">{fee.description}</p> : null}</div>
              <div className="flex items-center gap-2"><Badge value={fee.isActive ? "ACTIVE" : "INACTIVE"} /><button type="button" disabled={feeSaving} onClick={() => beginFeeEdit(fee)} className="rounded-lg border border-black/10 px-3 py-2 text-[10px] font-black text-[#0B2633] disabled:opacity-50">Edit</button><button type="button" disabled={feeSaving} onClick={() => void toggleFeeDefinition(fee)} className="rounded-lg border border-black/10 px-3 py-2 text-[10px] font-black text-[#0B2633] disabled:opacity-50">{fee.isActive ? "Deactivate" : "Activate"}</button></div>
            </div>
            {editingFeeId === fee.id ? <form onSubmit={(event) => { event.preventDefault(); void saveFeeDefinition(fee); }} className="mt-4 grid gap-3 rounded-2xl bg-[#F8FBFC] p-4 md:grid-cols-2"><label className="text-xs font-bold text-black/60">Fee name<input required maxLength={150} value={editFeeName} onChange={(event) => setEditFeeName(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" /></label><label className="text-xs font-bold text-black/60">Description<input maxLength={500} value={editFeeDescription} onChange={(event) => setEditFeeDescription(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" /></label><div className="flex gap-2 md:col-span-2"><button disabled={feeSaving} className="rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white disabled:opacity-50">{feeSaving ? "Saving…" : "Save fee definition"}</button><button type="button" onClick={() => setEditingFeeId(null)} className="rounded-xl border border-black/10 px-4 py-2 text-xs font-black text-[#0B2633]">Cancel</button></div></form> : null}
            <div className="mt-5 space-y-3">
              {(fee.schedules ?? []).length === 0 ? <p className="rounded-xl bg-[#F8FBFC] p-4 text-sm text-black/45">No fee schedules are attached to this definition.</p> : fee.schedules?.map((schedule) => (
                <div key={schedule.id} className="rounded-2xl bg-[#F8FBFC] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="text-sm font-bold text-[#0B2633]">{schedule.name}</p><p className="mt-1 text-xs text-black/45">{schedule.memberCategory ? formatStatus(schedule.memberCategory) : "All member categories"} · {schedule.constitutionalCategory ? formatStatus(schedule.constitutionalCategory) : "All constitutional categories"} · Effective {formatDate(schedule.effectiveFrom)}{schedule.effectiveTo ? ` – ${formatDate(schedule.effectiveTo)}` : " onward"}</p></div>
                    <div className="flex items-center gap-3"><p className="text-sm font-black text-[#0B2633]">{formatCurrency(schedule.amount, schedule.currency)}</p><Badge value={schedule.status} /><button type="button" disabled={feeSaving || ["CANCELLED", "EXPIRED"].includes(schedule.status)} onClick={() => beginScheduleEdit(schedule)} className="rounded-lg border border-black/10 px-3 py-2 text-[10px] font-black text-[#0B2633] disabled:opacity-40">Edit</button></div>
                  </div>
                  {editingScheduleId === schedule.id ? <form onSubmit={(event) => { event.preventDefault(); void saveFeeSchedule(schedule); }} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <label className="text-xs font-bold text-black/60">Schedule name<input required maxLength={150} value={editScheduleName} onChange={(event) => setEditScheduleName(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" /></label>
                    <label className="text-xs font-bold text-black/60">Amount (KES)<input required type="number" min="0" step="0.01" value={editScheduleAmount} onChange={(event) => setEditScheduleAmount(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" /></label>
                    <label className="text-xs font-bold text-black/60">Status<select value={editScheduleStatus} onChange={(event) => setEditScheduleStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="EXPIRED">Expired</option><option value="CANCELLED">Cancelled</option></select></label>
                    <label className="text-xs font-bold text-black/60">Effective from<input required type="date" value={editScheduleFrom} onChange={(event) => setEditScheduleFrom(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" /></label>
                    <label className="text-xs font-bold text-black/60">Effective to<input type="date" value={editScheduleTo} onChange={(event) => setEditScheduleTo(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" /></label>
                    <label className="text-xs font-bold text-black/60">Member category<select value={editScheduleMemberCategory} onChange={(event) => setEditScheduleMemberCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"><option value="">All categories</option><option value="STUDENT">Student</option><option value="ALUMNI">Alumni</option><option value="LECTURER">Lecturer</option></select></label>
                    <label className="text-xs font-bold text-black/60">Constitutional category<select value={editScheduleConstitutionalCategory} onChange={(event) => setEditScheduleConstitutionalCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"><option value="">All categories</option><option value="ORDINARY">Ordinary</option><option value="ASSOCIATE">Associate</option><option value="ALUMNI">Alumni</option><option value="HONORARY">Honorary</option></select></label>
                    <div className="flex items-end gap-2 xl:col-span-3"><button disabled={feeSaving} className="rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white disabled:opacity-50">{feeSaving ? "Saving…" : "Save schedule"}</button><button type="button" onClick={() => setEditingScheduleId(null)} className="rounded-xl border border-black/10 px-4 py-2 text-xs font-black text-[#0B2633]">Cancel</button></div>
                  </form> : null}
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
