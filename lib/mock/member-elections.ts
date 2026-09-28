export const memberElectionsMock = {
  overview: {
    activeElections: 1,
    upcomingElections: 1,
    completedElections: 2,
    votingStatus: "Eligible",
  },

  elections: [
    {
      id: "election-001",
      title: "KUHRSA Executive Committee Election",
      status: "Active",
      openingDate: "08 September 2026",
      closingDate: "15 September 2026",
      description:
        "Election of members to selected KUHRSA executive committee positions.",
      positions: 4,
    },
    {
      id: "election-002",
      title: "KUHRSA Department Representatives Election",
      status: "Upcoming",
      openingDate: "05 October 2026",
      closingDate: "10 October 2026",
      description:
        "Election of departmental representatives for the upcoming association cycle.",
      positions: 6,
    },
    {
      id: "election-003",
      title: "Previous Executive Committee Election",
      status: "Completed",
      openingDate: "01 September 2025",
      closingDate: "07 September 2025",
      description:
        "Completed executive committee election.",
      positions: 5,
    },
  ],

  candidates: [
    {
      id: "candidate-001",
      name: "Jordan Taylor",
      position: "Chairperson",
      election: "KUHRSA Executive Committee Election",
      category: "Student",
    },
    {
      id: "candidate-002",
      name: "Morgan Lee",
      position: "Chairperson",
      election: "KUHRSA Executive Committee Election",
      category: "Student",
    },
    {
      id: "candidate-003",
      name: "Taylor Morgan",
      position: "Secretary",
      election: "KUHRSA Executive Committee Election",
      category: "Student",
    },
    {
      id: "candidate-004",
      name: "Casey Jordan",
      position: "Secretary",
      election: "KUHRSA Executive Committee Election",
      category: "Student",
    },
  ],

  positions: [
    {
      id: "position-001",
      title: "Chairperson",
      candidates: 2,
    },
    {
      id: "position-002",
      title: "Secretary",
      candidates: 2,
    },
    {
      id: "position-003",
      title: "Treasurer",
      candidates: 0,
    },
    {
      id: "position-004",
      title: "Organizing Secretary",
      candidates: 0,
    },
  ],

  eligibility: {
    status: "Eligible",
    election: "KUHRSA Executive Committee Election",
    reason:
      "Membership is active and the member meets the current election eligibility requirements.",
  },

  voting: {
    election: "KUHRSA Executive Committee Election",
    status: "Not Yet Voted",
    instructions: [
      "Review the election information.",
      "Review candidate information.",
      "Select the permitted candidate for each position.",
      "Review your selections before submitting.",
    ],
  },

  votingRecord: [
    {
      id: "vote-001",
      election: "Previous Executive Committee Election",
      date: "07 September 2025",
      status: "Recorded",
    },
    {
      id: "vote-002",
      election: "Previous Department Representatives Election",
      date: "12 October 2025",
      status: "Recorded",
    },
  ],

  results: [
    {
      id: "result-001",
      election: "Previous Executive Committee Election",
      status: "Published",
      publishedDate: "08 September 2025",
    },
  ],
};
