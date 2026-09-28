"use client";

import Link from "next/link";

import { memberFinanceMock } from "@/lib/mock/member-finance";

type FinanceView =
  | "overview"
  | "fees"
  | "payment"
  | "history"
  | "balance"
  | "receipts"
  | "statements";

type MemberFinanceWorkspaceProps = {
  view: FinanceView;
};

const mock = memberFinanceMock;

function formatCurrency(value: number) {
  return `KSh ${value.toLocaleString("en-KE")}`;
}

function statusClass(status: string) {
  switch (status) {
    case "Paid":
    case "Completed":
    case "Issued":
      return "bg-emerald-50 text-emerald-700";

    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Failed":
      return "bg-red-50 text-red-700";

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

function ViewHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#168DB8]">
        Finance
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

export default function MemberFinanceWorkspace({
  view,
}: MemberFinanceWorkspaceProps) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {view === "overview" && (
        <>
          <ViewHeader
            title="Finance Overview"
            description="View your KUHRSA membership financial position, payments and available finance services."
          />

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              label="Current Balance"
              value={formatCurrency(
                mock.overview.balance,
              )}
            />

            <InfoTile
              label="Annual Fee"
              value={formatCurrency(
                mock.overview.annualFee,
              )}
            />

            <InfoTile
              label="Amount Paid"
              value={formatCurrency(
                mock.overview.amountPaid,
              )}
            />

            <InfoTile
              label="Payment Status"
              value={mock.overview.paymentStatus}
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                    Current Cycle
                  </p>

                  <h2 className="mt-1 text-xl font-black text-[#0B2633]">
                    {mock.overview.currentPeriod}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                    mock.overview.paymentStatus,
                  )}`}
                >
                  {mock.overview.paymentStatus}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoTile
                  label="Annual Membership Fee"
                  value={formatCurrency(
                    mock.overview.annualFee,
                  )}
                />

                <InfoTile
                  label="Paid"
                  value={formatCurrency(
                    mock.overview.amountPaid,
                  )}
                />

                <InfoTile
                  label="Outstanding"
                  value={formatCurrency(
                    mock.overview.balance,
                  )}
                />

                <InfoTile
                  label="Next Renewal"
                  value={mock.overview.nextRenewal}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Finance Services
              </p>

              <div className="mt-4 space-y-2">
                <ActionLink
                  href="/dashboard/finance/payment"
                  label="Make Payment"
                />

                <ActionLink
                  href="/dashboard/finance/history"
                  label="Payment History"
                />

                <ActionLink
                  href="/dashboard/finance/receipts"
                  label="Receipts"
                />

                <ActionLink
                  href="/dashboard/finance/statements"
                  label="Statements"
                />
              </div>
            </div>
          </section>
        </>
      )}

      {view === "fees" && (
        <>
          <ViewHeader
            title="Membership Fees"
            description="Review the membership fees associated with your current KUHRSA membership cycle."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] text-left">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Fee
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Period
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Paid
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {mock.fees.map((fee) => (
                    <tr
                      key={fee.id}
                      className="border-b border-black/[0.04]"
                    >
                      <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                        {fee.name}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {fee.period}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {formatCurrency(fee.amount)}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {formatCurrency(fee.paid)}
                      </td>

                      <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                        {formatCurrency(fee.balance)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                            fee.status,
                          )}`}
                        >
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {view === "payment" && (
        <>
          <ViewHeader
            title="Make Payment"
            description="Start a KUHRSA membership payment through the available payment channels."
          />

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Payment Amount
              </p>

              <p className="mt-3 text-4xl font-black text-[#0B2633]">
                {formatCurrency(
                  mock.overview.balance,
                )}
              </p>

              <p className="mt-3 text-sm leading-6 text-black/45">
                Your current development balance is
                zero. The production payment form will
                calculate the amount due from your actual
                finance records.
              </p>

              <div className="mt-7 rounded-2xl border border-black/[0.06] bg-[#F8FBFC] p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0B2633]">
                  Payment Channel
                </p>

                <p className="mt-2 text-sm font-bold text-black/55">
                  M-Pesa
                </p>

                <p className="mt-1 text-xs text-black/35">
                  Production M-Pesa processing will be
                  connected through the finance backend.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#168DB8]/10 bg-[#168DB8]/5 p-6">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Development Mode
              </p>

              <p className="mt-3 text-sm leading-6 text-black/55">
                No real payment is processed by this
                frontend workspace. Payment initiation,
                transaction status and receipts will be
                connected to the backend later.
              </p>
            </div>
          </section>
        </>
      )}

      {view === "history" && (
        <>
          <ViewHeader
            title="Payment History"
            description="Review payments recorded against your KUHRSA membership."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] text-left">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Date
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Description
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Method
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {mock.payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-black/[0.04]"
                    >
                      <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                        {payment.reference}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {payment.date}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {payment.description}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {payment.method}
                      </td>

                      <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                            payment.status,
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {view === "balance" && (
        <>
          <ViewHeader
            title="Outstanding Balance"
            description="View the amount currently outstanding on your KUHRSA membership account."
          />

          <section className="mt-6 rounded-3xl bg-[#0B2633] p-8 text-white shadow-[0_18px_50px_rgba(11,38,51,0.14)]">
            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-white/40">
              Current Balance
            </p>

            <p className="mt-3 text-5xl font-black tracking-tight">
              {formatCurrency(
                mock.overview.balance,
              )}
            </p>

            <p className="mt-3 text-sm text-white/55">
              Your development finance record currently
              shows no outstanding membership balance.
            </p>

            <Link
              href="/dashboard/finance/payment"
              className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0B2633] transition hover:bg-white/90"
            >
              Make Payment
            </Link>
          </section>
        </>
      )}

      {view === "receipts" && (
        <>
          <ViewHeader
            title="Receipts"
            description="View receipts issued for your KUHRSA payments."
          />

          <section className="mt-6 grid gap-4">
            {mock.receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                      {receipt.receiptNumber}
                    </p>

                    <h2 className="mt-2 text-lg font-black text-[#0B2633]">
                      {receipt.description}
                    </h2>

                    <p className="mt-1 text-xs text-black/40">
                      {receipt.date}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-lg font-black text-[#0B2633]">
                      {formatCurrency(
                        receipt.amount,
                      )}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                        receipt.status,
                      )}`}
                    >
                      {receipt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {view === "statements" && (
        <>
          <ViewHeader
            title="Statements"
            description="Review a summary of charges, payments and balances for your membership period."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoTile
                label="Period"
                value={
                  mock.statements[0].period
                }
              />

              <InfoTile
                label="Opening Balance"
                value={formatCurrency(
                  mock.statements[0]
                    .openingBalance,
                )}
              />

              <InfoTile
                label="Charges"
                value={formatCurrency(
                  mock.statements[0].charges,
                )}
              />

              <InfoTile
                label="Payments"
                value={formatCurrency(
                  mock.statements[0].payments,
                )}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-[#0B2633] p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
                Closing Balance
              </p>

              <p className="mt-2 text-3xl font-black">
                {formatCurrency(
                  mock.statements[0]
                    .closingBalance,
                )}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
