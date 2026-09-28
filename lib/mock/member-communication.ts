export const memberCommunicationMock = {
  overview: {
    unreadNotifications: 3,
    unreadMessages: 2,
    openRequests: 1,
    preferredChannel: "Email",
  },

  notifications: [
    {
      id: "notification-001",
      title: "Membership renewal reminder",
      message:
        "Your current membership cycle is approaching its renewal period.",
      type: "Membership",
      date: "09 September 2026",
      time: "09:15 AM",
      read: false,
    },
    {
      id: "notification-002",
      title: "Professional Development Forum",
      message:
        "Your registration for the upcoming professional development forum has been confirmed.",
      type: "Event",
      date: "08 September 2026",
      time: "02:10 PM",
      read: false,
    },
    {
      id: "notification-003",
      title: "New KUHRSA resource",
      message:
        "A new member resource has been published in the resource centre.",
      type: "Resource",
      date: "07 September 2026",
      time: "10:30 AM",
      read: false,
    },
    {
      id: "notification-004",
      title: "Activity registration confirmed",
      message:
        "Your registration for the student mentorship programme is active.",
      type: "Activity",
      date: "06 September 2026",
      time: "04:20 PM",
      read: true,
    },
    {
      id: "notification-005",
      title: "KUHRSA announcement",
      message:
        "A new association announcement is available for members.",
      type: "Announcement",
      date: "04 September 2026",
      time: "11:45 AM",
      read: true,
    },
  ],

  messages: [
    {
      id: "message-001",
      sender: "KUHRSA Secretariat",
      subject: "Member information update",
      preview:
        "Please review the latest information regarding member services.",
      date: "08 September 2026",
      time: "01:15 PM",
      read: false,
    },
    {
      id: "message-002",
      sender: "KUHRSA Events Desk",
      subject: "Event registration confirmation",
      preview:
        "Your registration for the professional development forum has been confirmed.",
      date: "07 September 2026",
      time: "03:40 PM",
      read: false,
    },
    {
      id: "message-003",
      sender: "KUHRSA Administration",
      subject: "Welcome to the member portal",
      preview:
        "Your KUHRSA member portal account is ready to use.",
      date: "01 September 2026",
      time: "08:20 AM",
      read: true,
    },
  ],

  support: {
    openRequests: 1,
    resolvedRequests: 3,
    requests: [
      {
        id: "support-001",
        reference: "REQ-TEST-001",
        subject: "Membership profile assistance",
        category: "Membership",
        submitted: "08 September 2026",
        status: "Open",
        priority: "Normal",
      },
      {
        id: "support-002",
        reference: "REQ-TEST-002",
        subject: "Event registration assistance",
        category: "Events",
        submitted: "20 August 2026",
        status: "Resolved",
        priority: "Normal",
      },
    ],
  },

  feedback: {
    submitted: 2,
    entries: [
      {
        id: "feedback-001",
        subject: "Member dashboard experience",
        date: "02 September 2026",
        status: "Received",
      },
      {
        id: "feedback-002",
        subject: "Event registration experience",
        date: "28 August 2026",
        status: "Reviewed",
      },
    ],
  },

  preferences: {
    email: true,
    sms: false,
    portal: true,
    eventReminders: true,
    membershipReminders: true,
    financeNotifications: true,
    announcements: true,
    activityNotifications: true,
  },
};
