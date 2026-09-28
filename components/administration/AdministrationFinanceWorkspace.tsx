"use client";

import Link from "next/link";

type FinanceView =
  | "dashboard"
  | "fees"
  | "payments"
  | "history"
  | "mpesa"
  | "reconciliation"
  | "receipts"
  | "refunds"
  | "expenses"
  | "budgets"
  | "ledger"
  | "reports";

type Props = {
  view: FinanceView;
};

const payments = [
  {
    reference: "PAY-2026-041",
    member: "KUHRSA-STD-0042",
    amount: "KSh 200",
    method: "M-Pesa",
    date: "08 Sep 2026",
    status: "Verified",
  },
  {
    reference: "PAY-2026-040",
    member: "KUHRSA-STD-0077",
    amount: "KSh 250",
    method: "Manual",
    date: "08 Sep 2026",
    status: "Pending",
  },
  {
    reference: "PAY-2026-039",
    member: "KUHRSA-ALU-0018",
    amount: "KSh 200",
    method: "M-Pesa",
    date: "07 Sep 2026",
    status: "Verified",
  },
  {
    reference: "PAY-2026-038",
    member: "KUHRSA-STD-0114",
    amount: "KSh 50",
    method: "M-Pesa",
    date: "07 Sep 2026",
    status: "Reconciliation Required",
  },
];

const expenses = [
  {
    reference: "EXP-026",
    title: "Event logistics",
    amount: "KSh 18,500",
    category: "Events",
    status: "Approved",
  },
  {
    reference: "EXP-025",
    title: "Printing and publicity",
    amount: "KSh 6,800",
    category: "Publicity",
    status: "Pending",
  },
  {
    reference: "EXP-024",
    title: "Stationery",
    amount: "KSh 3,450",
    category: "Administration",
    status: "Paid",
  },
];

const reconciliation = [
  {
    reference: "MP-7281",
    amount: "KSh 200",
    member: "KUHRSA-STD-0042",
    status: "Matched",
  },
  {
    reference: "MP-7280",
    amount: "KSh 250",
    member: "Unmatched",
    status: "Review Required",
  },
  {
    reference: "MP-7279",
    amount: "KSh 50",
    member: "KUHRSA-STD-0114",
    status: "Matched",
  },
];

const budgets = [
  ["Membership Operations", "KSh 120,000", "KSh 84,200"],
  ["Events & Activities", "KSh 180,000", "KSh 96,500"],
  ["Publicity & Communication", "KSh 75,000", "KSh 41,200"],
  ["Administration", "KSh 60,000", "KSh 27,350"],
];

const ledgerEntries = [
  ["08 Sep 2026", "Membership fees", "Credit", "KSh 200"],
  ["08 Sep 2026", "Event logistics", "Debit", "KSh 18,500"],
  ["08 Sep 2026", "Membership fees", "Credit", "KSh 250"],
  ["07 Sep 2026", "Printing", "Debit", "KSh 6,800"],
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
        Finance & Payments
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
    value === "Verified" ||
    value === "Matched" ||
    value === "Approved" ||
    value === "Paid";

  const attention =
    value === "Pending" ||
    value === "Review Required" ||
    value === "Pending Approval" ||
    value === "Reconciliation Required";

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

function PaymentsTable({
  title,
  data = payments,
}: {
  title: string;
  data?: typeof payments;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2633]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Synthetic finance records for frontend development.
          </p>
        </div>

        <Link
          href="/administration/finance/reconciliation"
          className="text-sm font-black text-[#CE26A4]"
        >
          Reconciliation →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-black/[0.06]">
              {[
                "Reference",
                "Member",
                "Amount",
                "Method",
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
                key={item.reference}
                className="border-b border-black/[0.05] last:border-0"
              >
                <td className="px-3 py-4 text-xs font-black text-[#CE26A4] first:pl-0">
                  {item.reference}
                </td>

                <td className="px-3 py-4 text-xs font-semibold text-black/55">
                  {item.member}
                </td>

                <td className="px-3 py-4 text-sm font-black text-[#0B2633]">
                  {item.amount}
                </td>

                <td className="px-3 py-4 text-xs text-black/55">
                  {item.method}
                </td>

                <td className="px-3 py-4 text-xs text-black/55">
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
  );
}

function DashboardView() {
  return (
    <div className="space-y-6">
      <Header
        title="Finance Dashboard"
        description="Administrative oversight of membership fees, payments, M-Pesa transactions, reconciliation, expenses, budgets, receipts and financial reporting."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Collections" value="KSh 186,400" />
        <StatCard label="Membership Fees" value="KSh 142,700" />
        <StatCard label="Outstanding" value="KSh 48,600" />
        <StatCard label="Pending Reconciliation" value="8" />
      </section>

      <PaymentsTable title="Recent Payments" />

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Budget Utilization
          </h2>

          <div className="mt-5 space-y-4">
            {budgets.map(([name, total, used]) => (
              <div key={name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-black/55">
                    {name}
                  </span>

                  <span className="text-xs font-black text-[#0B2633]">
                    {used} / {total}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className="h-full rounded-full bg-[#CE26A4]"
                    style={{
                      width:
                        name === "Membership Operations"
                          ? "70%"
                          : name === "Events & Activities"
                            ? "54%"
                            : name === "Publicity & Communication"
                              ? "55%"
                              : "46%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Finance Quick Access
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Membership Fees", "/administration/finance/fees"],
              ["Payments", "/administration/finance/payments"],
              ["M-Pesa", "/administration/finance/mpesa"],
              ["Reconciliation", "/administration/finance/reconciliation"],
              ["Expenses", "/administration/finance/expenses"],
              ["Reports", "/administration/finance/reports"],
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
    </div>
  );
}

function FeesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Membership Fees"
        description="Configure and monitor KUHRSA membership fee structures and collection."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Registration Fee" value="KSh 250" />
        <StatCard label="Annual Fee" value="KSh 200" />
        <StatCard label="Minimum Installment" value="KSh 50" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Fee Configuration
        </h2>

        <div className="mt-5 space-y-3">
          {[
            ["Registration", "KSh 250", "One-time registration fee"],
            ["Annual Membership", "KSh 200", "Configurable annual fee"],
            ["Minimum Installment", "KSh 50", "Minimum accepted installment"],
          ].map(([name, amount, description]) => (
            <div
              key={name}
              className="flex flex-col gap-3 rounded-2xl bg-[#F8FBFC] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {description}
                </p>
              </div>

              <span className="text-sm font-black text-[#CE26A4]">
                {amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PaymentsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Payments"
        description="Review membership and other KUHRSA payment transactions."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Today" value="KSh 6,450" />
        <StatCard label="This Month" value="KSh 84,700" />
        <StatCard label="Pending" value="12" />
      </section>

      <PaymentsTable title="Payment Register" />
    </div>
  );
}

function HistoryView() {
  return (
    <div className="space-y-6">
      <Header
        title="Payment History"
        description="Historical record of financial transactions."
      />

      <PaymentsTable title="Historical Payments" />
    </div>
  );
}

function MpesaView() {
  return (
    <div className="space-y-6">
      <Header
        title="M-Pesa Transactions"
        description="Administrative view of incoming M-Pesa transaction records."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Transactions Today" value="42" />
        <StatCard label="Value Today" value="KSh 8,450" />
        <StatCard label="Unreconciled" value="8" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="space-y-3">
          {reconciliation.map((item) => (
            <div
              key={item.reference}
              className="rounded-2xl bg-[#F8FBFC] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[#0B2633]">
                    {item.reference}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {item.member} • {item.amount}
                  </p>
                </div>

                <Badge value={item.status} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
          Development Mode
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          No live M-Pesa transactions are processed from this frontend. Daraja
          integration and reconciliation will be connected later.
        </p>
      </div>
    </div>
  );
}

function ReconciliationView() {
  return (
    <div className="space-y-6">
      <Header
        title="Payment Reconciliation"
        description="Match incoming payment transactions to KUHRSA member records."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Matched" value="34" />
        <StatCard label="Needs Review" value="8" />
        <StatCard label="Total Value" value="KSh 8,450" />
      </section>

      <section className="space-y-3">
        {reconciliation.map((item) => (
          <div
            key={item.reference}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.reference}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.member} • {item.amount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge value={item.status} />

                {item.status === "Review Required" && (
                  <button
                    type="button"
                    className="rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ReceiptsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Receipts"
        description="Review and manage payment receipt records."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Receipts Issued" value="684" />
        <StatCard label="Pending" value="12" />
        <StatCard label="This Month" value="84" />
      </section>

      <PaymentsTable title="Receipt-Linked Payments" />
    </div>
  );
}

function RefundsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Refunds"
        description="Review and manage refund requests and approved refunds."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending Requests" value="3" />
        <StatCard label="Approved" value="8" />
        <StatCard label="Total This Period" value="KSh 4,250" />
      </section>

      <section className="space-y-3">
        {[
          ["REF-009", "KSh 500", "Membership overpayment", "Pending"],
          ["REF-008", "KSh 250", "Duplicate payment", "Approved"],
          ["REF-007", "KSh 300", "Event cancellation", "Paid"],
        ].map(([reference, amount, reason, status]) => (
          <div
            key={reference}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {reference}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {reason} • {amount}
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

function ExpensesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Expenses"
        description="Track KUHRSA operational expenditures."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Expenses" value="KSh 28,750" />
        <StatCard label="Pending Approval" value="6" />
        <StatCard label="This Month" value="KSh 42,300" />
      </section>

      <section className="space-y-3">
        {expenses.map((item) => (
          <div
            key={item.reference}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.reference} • {item.category} • {item.amount}
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

function BudgetsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Budgets"
        description="Plan and monitor KUHRSA budgets across operational areas."
      />

      <section className="space-y-4">
        {budgets.map(([name, total, used]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-[#0B2633]">
                {name}
              </p>

              <p className="text-xs font-bold text-black/45">
                {used} used of {total}
              </p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/[0.05]">
              <div
                className="h-full rounded-full bg-[#CE26A4]"
                style={{
                  width:
                    name === "Membership Operations"
                      ? "70%"
                      : name === "Events & Activities"
                        ? "54%"
                        : name === "Publicity & Communication"
                          ? "55%"
                          : "46%",
                }}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function LedgerView() {
  return (
    <div className="space-y-6">
      <Header
        title="Financial Ledger"
        description="Administrative ledger of synthetic KUHRSA financial entries."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["Date", "Description", "Type", "Amount"].map((item) => (
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
              {ledgerEntries.map(([date, description, type, amount]) => (
                <tr
                  key={`${date}-${description}-${amount}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-xs text-black/55 first:pl-0">
                    {date}
                  </td>

                  <td className="px-3 py-4 text-sm font-black text-[#0B2633]">
                    {description}
                  </td>

                  <td className="px-3 py-4 text-xs font-semibold text-black/55">
                    {type}
                  </td>

                  <td className="px-3 py-4 text-sm font-black text-[#0B2633]">
                    {amount}
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

function ReportsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Financial Reports"
        description="Administrative financial reporting and analysis."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Collections" value="KSh 186,400" />
        <StatCard label="Expenses" value="KSh 42,300" />
        <StatCard label="Outstanding" value="KSh 48,600" />
        <StatCard label="Net Position" value="KSh 144,100" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Available Reports
        </h2>

        <div className="mt-5 space-y-3">
          {[
            "Membership fee collection report",
            "Payment transaction report",
            "M-Pesa reconciliation report",
            "Receipt report",
            "Refund report",
            "Expense report",
            "Budget utilization report",
            "Financial ledger report",
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

export default function AdministrationFinanceWorkspace({
  view,
}: Props) {
  switch (view) {
    case "fees":
      return <FeesView />;

    case "payments":
      return <PaymentsView />;

    case "history":
      return <HistoryView />;

    case "mpesa":
      return <MpesaView />;

    case "reconciliation":
      return <ReconciliationView />;

    case "receipts":
      return <ReceiptsView />;

    case "refunds":
      return <RefundsView />;

    case "expenses":
      return <ExpensesView />;

    case "budgets":
      return <BudgetsView />;

    case "ledger":
      return <LedgerView />;

    case "reports":
      return <ReportsView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
