export const memberDashboardMock = {
  membership: {
    status: "Active",
    label: "Current",
    memberType: "Student Member",
    validUntil: "31 August 2027",
  },

  finance: {
    balance: 0,
    currency: "KSh",
    paidThisCycle: 200,
    nextRenewal: "01 September 2027",
  },

  events: {
    count: 3,
    items: [
      {
        id: "event-001",
        title: "Professional Development Forum",
        date: "18 September 2026",
        time: "10:00 AM",
        venue: "Kisii University Main Hall",
        category: "Professional Development",
      },
      {
        id: "event-002",
        title: "Student Leadership Dialogue",
        date: "25 September 2026",
        time: "2:00 PM",
        venue: "Student Centre",
        category: "Leadership",
      },
      {
        id: "event-003",
        title: "Career Networking Session",
        date: "03 October 2026",
        time: "11:00 AM",
        venue: "University Conference Room",
        category: "Career",
      },
    ],
  },

  activities: {
    count: 2,
    items: [
      {
        id: "activity-001",
        title: "Student Mentorship Programme",
        status: "Registered",
        date: "12 September 2026",
      },
      {
        id: "activity-002",
        title: "HR Career Development Workshop",
        status: "Registered",
        date: "26 September 2026",
      },
    ],
  },

  attendance: {
    percentage: 82,
    attended: 9,
    total: 11,
  },

  notifications: {
    count: 5,
    items: [
      {
        id: "notification-001",
        title: "Membership renewal reminder",
        body: "Your next membership renewal cycle will open soon.",
        time: "Today",
        type: "Membership",
      },
      {
        id: "notification-002",
        title: "Professional Development Forum",
        body: "Registration is confirmed for the upcoming forum.",
        time: "Yesterday",
        type: "Event",
      },
      {
        id: "notification-003",
        title: "New member resource",
        body: "A new career development resource has been published.",
        time: "2 days ago",
        type: "Resource",
      },
      {
        id: "notification-004",
        title: "Activity registration confirmed",
        body: "Your mentorship programme registration is active.",
        time: "3 days ago",
        type: "Activity",
      },
      {
        id: "notification-005",
        title: "KUHRSA announcement",
        body: "A new association announcement is available.",
        time: "5 days ago",
        type: "Announcement",
      },
    ],
  },

  announcements: [
    {
      id: "announcement-001",
      title: "Membership registration and renewal update",
      excerpt:
        "Important information concerning the current KUHRSA membership cycle.",
      date: "07 September 2026",
      category: "Membership",
    },
    {
      id: "announcement-002",
      title: "Professional development opportunities",
      excerpt:
        "New professional development opportunities are now available to members.",
      date: "05 September 2026",
      category: "Academic",
    },
    {
      id: "announcement-003",
      title: "Member participation opportunities",
      excerpt:
        "Explore upcoming opportunities to participate in KUHRSA programmes and activities.",
      date: "03 September 2026",
      category: "Participation",
    },
  ],
};
