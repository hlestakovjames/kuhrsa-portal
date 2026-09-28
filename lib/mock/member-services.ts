export const memberServicesMock = {
  overview: {
    availableServices: 5,
    openRequests: 1,
    resolvedRequests: 3,
    averageResponse: "1–2 working days",
  },

  services: [
    {
      id: "service-001",
      title: "Membership Assistance",
      description:
        "Get assistance with membership information, status and account issues.",
      category: "Membership",
    },
    {
      id: "service-002",
      title: "Event Support",
      description:
        "Request assistance with event registration, participation or attendance.",
      category: "Events",
    },
    {
      id: "service-003",
      title: "Finance Support",
      description:
        "Get help with payments, receipts, balances and finance records.",
      category: "Finance",
    },
    {
      id: "service-004",
      title: "Account Support",
      description:
        "Request assistance with your account, security or profile.",
      category: "Account",
    },
    {
      id: "service-005",
      title: "General Member Support",
      description:
        "Submit a general service request to KUHRSA administration.",
      category: "General",
    },
  ],

  requests: [
    {
      id: "request-001",
      reference: "REQ-TEST-001",
      subject: "Membership profile assistance",
      category: "Membership",
      submitted: "08 September 2026",
      updated: "09 September 2026",
      status: "Open",
      priority: "Normal",
      description:
        "Request for assistance reviewing membership profile information.",
      response:
        "Your request has been received and is awaiting review.",
    },
    {
      id: "request-002",
      reference: "REQ-TEST-002",
      subject: "Event registration assistance",
      category: "Events",
      submitted: "20 August 2026",
      updated: "21 August 2026",
      status: "Resolved",
      priority: "Normal",
      description:
        "Assistance with event registration.",
      response:
        "The registration issue was reviewed and resolved.",
    },
    {
      id: "request-003",
      reference: "REQ-TEST-003",
      subject: "Payment record inquiry",
      category: "Finance",
      submitted: "11 August 2026",
      updated: "12 August 2026",
      status: "Resolved",
      priority: "Normal",
      description:
        "Inquiry regarding a membership payment record.",
      response:
        "The payment record was reviewed successfully.",
    },
  ],

  help: [
    {
      id: "help-001",
      title: "Membership Help",
      description:
        "Find assistance with membership status, activation, renewal and verification.",
      href: "/dashboard/membership",
    },
    {
      id: "help-002",
      title: "Finance Help",
      description:
        "Find assistance with payments, balances, receipts and statements.",
      href: "/dashboard/finance",
    },
    {
      id: "help-003",
      title: "Events & Activities Help",
      description:
        "Find assistance with registrations, attendance and participation.",
      href: "/dashboard/events",
    },
    {
      id: "help-004",
      title: "Communication Help",
      description:
        "Find assistance with notifications, messages and communication settings.",
      href: "/dashboard/communication",
    },
  ],
};
