export const memberMembershipMock = {
  overview: {
    membershipType: "Student Member",
    status: "Active",
    statusLabel: "Current",
    membershipNumber: "KUHRSA-STD-TEST-001",
    registrationNumber: "REG-TEST-2026-001",
    validFrom: "01 September 2026",
    validUntil: "31 August 2027",
    category: "Student",
    joinedOn: "01 September 2026",
  },

  profile: {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.test",
    phone: "0700000000",
    programme: "Bachelor of Human Resource Management",
    yearOfStudy: 3,
    faculty: "School of Business and Economics",
    department: "Human Resource Management",
  },

  history: [
    {
      id: "membership-history-001",
      period: "2026 / 2027",
      status: "Active",
      startDate: "01 September 2026",
      endDate: "31 August 2027",
      source: "Registration",
    },
    {
      id: "membership-history-002",
      period: "2025 / 2026",
      status: "Expired",
      startDate: "01 September 2025",
      endDate: "31 August 2026",
      source: "Renewal",
    },
  ],

  verification: {
    verificationStatus: "Verified",
    lastVerified: "Today",
    verificationReference: "VERIFY-TEST-001",
    verifiedBy: "KUHRSA Administration",
  },

  activation: {
    status: "Activated",
    activationDate: "01 September 2026",
    accountStatus: "Active",
  },

  renewal: {
    currentPeriod: "2026 / 2027",
    renewalWindow: "Opens before the next membership cycle",
    currentStatus: "Not yet due",
    previousRenewal: "01 September 2025",
  },
};
