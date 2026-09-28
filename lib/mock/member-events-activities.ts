export const memberEventsActivitiesMock = {
  events: [
    {
      id: "event-001",
      title: "Professional Development Forum",
      category: "Professional Development",
      date: "18 September 2026",
      time: "10:00 AM",
      venue: "Kisii University Main Hall",
      status: "Upcoming",
      registrationStatus: "Registered",
      description:
        "A professional development forum focused on career growth, employability and workplace readiness.",
    },
    {
      id: "event-002",
      title: "Student Leadership Dialogue",
      category: "Leadership",
      date: "25 September 2026",
      time: "2:00 PM",
      venue: "Student Centre",
      status: "Upcoming",
      registrationStatus: "Open",
      description:
        "An interactive leadership dialogue bringing together students and association leaders.",
    },
    {
      id: "event-003",
      title: "Career Networking Session",
      category: "Career",
      date: "03 October 2026",
      time: "11:00 AM",
      venue: "University Conference Room",
      status: "Upcoming",
      registrationStatus: "Open",
      description:
        "A networking session connecting members with career and professional development opportunities.",
    },
    {
      id: "event-004",
      title: "Academic and Career Dialogue",
      category: "Academic",
      date: "20 August 2026",
      time: "1:00 PM",
      venue: "Lecture Theatre 2",
      status: "Past",
      registrationStatus: "Completed",
      description:
        "A dialogue covering academic progression and preparation for professional opportunities.",
    },
  ],

  activities: [
    {
      id: "activity-001",
      title: "Student Mentorship Programme",
      category: "Mentorship",
      date: "12 September 2026",
      time: "9:00 AM",
      venue: "Student Centre",
      status: "Upcoming",
      registrationStatus: "Registered",
      description:
        "A structured mentorship programme supporting students through peer and professional guidance.",
    },
    {
      id: "activity-002",
      title: "HR Career Development Workshop",
      category: "Career",
      date: "26 September 2026",
      time: "9:30 AM",
      venue: "Business School Seminar Room",
      status: "Upcoming",
      registrationStatus: "Registered",
      description:
        "A practical workshop covering career planning, CV development and professional positioning.",
    },
    {
      id: "activity-003",
      title: "Community Engagement Activity",
      category: "Community",
      date: "15 August 2026",
      time: "8:00 AM",
      venue: "Kisii University Community Grounds",
      status: "Past",
      registrationStatus: "Completed",
      description:
        "A member participation activity focused on community engagement and service.",
    },
  ],

  registrations: [
    {
      id: "registration-001",
      type: "Event",
      title: "Professional Development Forum",
      date: "18 September 2026",
      registrationDate: "07 September 2026",
      status: "Confirmed",
    },
    {
      id: "registration-002",
      type: "Activity",
      title: "Student Mentorship Programme",
      date: "12 September 2026",
      registrationDate: "06 September 2026",
      status: "Confirmed",
    },
    {
      id: "registration-003",
      type: "Activity",
      title: "HR Career Development Workshop",
      date: "26 September 2026",
      registrationDate: "05 September 2026",
      status: "Confirmed",
    },
  ],

  attendance: [
    {
      id: "attendance-001",
      type: "Event",
      title: "Academic and Career Dialogue",
      date: "20 August 2026",
      attendanceStatus: "Present",
    },
    {
      id: "attendance-002",
      type: "Activity",
      title: "Community Engagement Activity",
      date: "15 August 2026",
      attendanceStatus: "Present",
    },
    {
      id: "attendance-003",
      type: "Event",
      title: "Student Leadership Session",
      date: "08 August 2026",
      attendanceStatus: "Present",
    },
    {
      id: "attendance-004",
      type: "Activity",
      title: "Professional Skills Workshop",
      date: "31 July 2026",
      attendanceStatus: "Absent",
    },
  ],

  history: [
    {
      id: "history-001",
      type: "Event",
      title: "Academic and Career Dialogue",
      date: "20 August 2026",
      participation: "Attended",
    },
    {
      id: "history-002",
      type: "Activity",
      title: "Community Engagement Activity",
      date: "15 August 2026",
      participation: "Attended",
    },
  ],

  certificates: [
    {
      id: "certificate-001",
      certificateNumber: "CERT-TEST-001",
      title: "Community Engagement Activity",
      issueDate: "20 August 2026",
      status: "Issued",
    },
  ],
};
