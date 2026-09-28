export const memberFinanceMock = {
  overview: {
    balance: 0,
    currency: "KSh",
    annualFee: 200,
    amountPaid: 200,
    paymentStatus: "Paid",
    currentPeriod: "2026 / 2027",
    nextRenewal: "31 August 2027",
  },

  fees: [
    {
      id: "fee-001",
      name: "Annual Membership Fee",
      period: "2026 / 2027",
      amount: 200,
      paid: 200,
      balance: 0,
      status: "Paid",
    },
  ],

  payments: [
    {
      id: "payment-001",
      reference: "PAY-TEST-001",
      date: "01 September 2026",
      description: "Annual Membership Fee",
      method: "M-Pesa",
      amount: 200,
      status: "Completed",
    },
  ],

  receipts: [
    {
      id: "receipt-001",
      receiptNumber: "RCT-TEST-001",
      date: "01 September 2026",
      description: "Annual Membership Fee",
      amount: 200,
      status: "Issued",
    },
  ],

  statements: [
    {
      id: "statement-001",
      period: "2026 / 2027",
      openingBalance: 0,
      charges: 200,
      payments: 200,
      closingBalance: 0,
    },
  ],
};
