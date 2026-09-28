"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import {
  AuthUser,
  PortalType,
} from "@/lib/auth";

type DashboardSidebarProps = {
  portal: PortalType;
  user: AuthUser;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

type IconType =
  | "dashboard"
  | "membership"
  | "finance"
  | "events"
  | "activities"
  | "elections"
  | "content"
  | "communication"
  | "services"
  | "account"
  | "users"
  | "leadership"
  | "secretariat"
  | "reports"
  | "ict"
  | "system";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

function getMemberSections(): NavSection[] {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: "dashboard",
        },
        {
          label: "Membership Summary",
          href: "/dashboard/membership",
          icon: "membership",
        },
        {
          label: "Upcoming Events",
          href: "/dashboard/events/upcoming",
          icon: "events",
        },
        {
          label: "Latest Announcements",
          href: "/dashboard/content/announcements",
          icon: "content",
        },
        {
          label: "Notifications",
          href: "/dashboard/communication/notifications",
          icon: "communication",
        },
      ],
    },
    {
      id: "membership",
      label: "My Membership",
      items: [
        {
          label: "Membership Overview",
          href: "/dashboard/membership",
          icon: "membership",
        },
        {
          label: "My Profile",
          href: "/dashboard/membership/profile",
          icon: "account",
        },
        {
          label: "Membership Status",
          href: "/dashboard/membership/status",
          icon: "membership",
        },
        {
          label: "Membership Number",
          href: "/dashboard/membership/number",
          icon: "membership",
        },
        {
          label: "Membership Card",
          href: "/dashboard/membership/card",
          icon: "membership",
        },
        {
          label: "Membership QR Code",
          href: "/dashboard/membership/qr",
          icon: "membership",
        },
        {
          label: "Membership History",
          href: "/dashboard/membership/history",
          icon: "membership",
        },
        {
          label: "Activation",
          href: "/dashboard/membership/activation",
          icon: "membership",
        },
        {
          label: "Renewal",
          href: "/dashboard/membership/renewal",
          icon: "membership",
        },
        {
          label: "Member Verification",
          href: "/dashboard/membership/verification",
          icon: "membership",
        },
      ],
    },
    {
      id: "finance",
      label: "Finance",
      items: [
        {
          label: "Finance Overview",
          href: "/dashboard/finance",
          icon: "finance",
        },
        {
          label: "Membership Fees",
          href: "/dashboard/finance/fees",
          icon: "finance",
        },
        {
          label: "Make Payment",
          href: "/dashboard/finance/payment",
          icon: "finance",
        },
        {
          label: "Payment History",
          href: "/dashboard/finance/history",
          icon: "finance",
        },
        {
          label: "Outstanding Balance",
          href: "/dashboard/finance/balance",
          icon: "finance",
        },
        {
          label: "Receipts",
          href: "/dashboard/finance/receipts",
          icon: "finance",
        },
        {
          label: "Statements",
          href: "/dashboard/finance/statements",
          icon: "finance",
        },
      ],
    },
    {
      id: "events-activities",
      label: "Events & Activities",
      items: [
        {
          label: "Events Overview",
          href: "/dashboard/events",
          icon: "events",
        },
        {
          label: "Events",
          href: "/dashboard/events/all",
          icon: "events",
        },
        {
          label: "Activities",
          href: "/dashboard/activities",
          icon: "activities",
        },
        {
          label: "Upcoming Events",
          href: "/dashboard/events/upcoming",
          icon: "events",
        },
        {
          label: "Upcoming Activities",
          href: "/dashboard/activities/upcoming",
          icon: "activities",
        },
        {
          label: "Event Registration",
          href: "/dashboard/events/registration",
          icon: "events",
        },
        {
          label: "Activity Registration",
          href: "/dashboard/activities/registration",
          icon: "activities",
        },
        {
          label: "My Registrations",
          href: "/dashboard/events/registrations",
          icon: "events",
        },
        {
          label: "Attendance",
          href: "/dashboard/events/attendance",
          icon: "events",
        },
        {
          label: "Event History",
          href: "/dashboard/events/history",
          icon: "events",
        },
        {
          label: "Certificates",
          href: "/dashboard/events/certificates",
          icon: "content",
        },
      ],
    },
    {
      id: "elections",
      label: "Elections",
      items: [
        {
          label: "Elections Overview",
          href: "/dashboard/elections",
          icon: "elections",
        },
        {
          label: "Active Elections",
          href: "/dashboard/elections/active",
          icon: "elections",
        },
        {
          label: "Election Information",
          href: "/dashboard/elections/information",
          icon: "elections",
        },
        {
          label: "Candidates",
          href: "/dashboard/elections/candidates",
          icon: "users",
        },
        {
          label: "Eligibility",
          href: "/dashboard/elections/eligibility",
          icon: "elections",
        },
        {
          label: "Voting",
          href: "/dashboard/elections/voting",
          icon: "elections",
        },
        {
          label: "My Voting Record",
          href: "/dashboard/elections/record",
          icon: "elections",
        },
        {
          label: "Results",
          href: "/dashboard/elections/results",
          icon: "reports",
        },
      ],
    },
    {
      id: "content",
      label: "Content & Resources",
      items: [
        {
          label: "Announcements",
          href: "/dashboard/content/announcements",
          icon: "content",
        },
        {
          label: "News",
          href: "/dashboard/content/news",
          icon: "content",
        },
        {
          label: "Blog",
          href: "/dashboard/content/blog",
          icon: "content",
        },
        {
          label: "Resources",
          href: "/dashboard/content/resources",
          icon: "content",
        },
        {
          label: "Downloads",
          href: "/dashboard/content/downloads",
          icon: "content",
        },
      ],
    },
    {
      id: "communication",
      label: "Communication",
      items: [
        {
          label: "Communication Overview",
          href: "/dashboard/communication",
          icon: "communication",
        },
        {
          label: "Notifications",
          href: "/dashboard/communication/notifications",
          icon: "communication",
        },
        {
          label: "Messages",
          href: "/dashboard/communication/messages",
          icon: "communication",
        },
        {
          label: "Support",
          href: "/dashboard/communication/support",
          icon: "services",
        },
        {
          label: "Feedback",
          href: "/dashboard/communication/feedback",
          icon: "communication",
        },
        {
          label: "Notification Preferences",
          href: "/dashboard/communication/preferences",
          icon: "account",
        },
      ],
    },
    {
      id: "services",
      label: "Member Services",
      items: [
        {
          label: "Services Overview",
          href: "/dashboard/services",
          icon: "services",
        },
        {
          label: "Submit Request",
          href: "/dashboard/services/submit",
          icon: "services",
        },
        {
          label: "My Requests",
          href: "/dashboard/services/requests",
          icon: "services",
        },
        {
          label: "Request Status",
          href: "/dashboard/services/status",
          icon: "services",
        },
        {
          label: "Help & Support",
          href: "/dashboard/services/help",
          icon: "services",
        },
      ],
    },
    {
      id: "account",
      label: "Account",
      items: [
        {
          label: "Profile",
          href: "/dashboard/account/profile",
          icon: "account",
        },
        {
          label: "Security",
          href: "/dashboard/account/security",
          icon: "account",
        },
        {
          label: "Login History",
          href: "/dashboard/account/login-history",
          icon: "account",
        },
        {
          label: "Settings",
          href: "/dashboard/account/settings",
          icon: "account",
        },
      ],
    },
  ];
}

function getExecutiveSections(): NavSection[] {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        {
          label: "Dashboard",
          href: "/executive/dashboard",
          icon: "dashboard",
        },
      ],
    },
    {
      id: "leadership",
      label: "Leadership",
      items: [
        {
          label: "My Executive Role",
          href: "/executive/leadership",
          icon: "leadership",
        },
        {
          label: "Term / Appointment",
          href: "/executive/leadership/term",
          icon: "leadership",
        },
        {
          label: "Committees",
          href: "/executive/leadership/committees",
          icon: "leadership",
        },
      ],
    },
    {
      id: "members",
      label: "Members",
      items: [
        {
          label: "Member Verification",
          href: "/executive/members/verification",
          icon: "membership",
        },
        {
          label: "Authorized Member Lookup",
          href: "/executive/members/lookup",
          icon: "users",
        },
        {
          label: "Membership Verification",
          href: "/executive/members/membership",
          icon: "membership",
        },
      ],
    },
    {
      id: "scanner",
      label: "QR Scanner",
      items: [
        {
          label: "QR Scanner",
          href: "/executive/scanner",
          icon: "membership",
        },
        {
          label: "Scan History",
          href: "/executive/scanner/history",
          icon: "reports",
        },
        {
          label: "Scan Context",
          href: "/executive/scanner/context",
          icon: "membership",
        },
      ],
    },
    {
      id: "events",
      label: "Events",
      items: [
        {
          label: "Events",
          href: "/executive/events",
          icon: "events",
        },
        {
          label: "Event Registration",
          href: "/executive/events/registration",
          icon: "events",
        },
        {
          label: "Event Attendance",
          href: "/executive/events/attendance",
          icon: "events",
        },
      ],
    },
    {
      id: "activities",
      label: "Activities",
      items: [
        {
          label: "Activities",
          href: "/executive/activities",
          icon: "activities",
        },
        {
          label: "Participation",
          href: "/executive/activities/participation",
          icon: "activities",
        },
      ],
    },
    {
      id: "attendance",
      label: "Attendance",
      items: [
        {
          label: "Attendance Sessions",
          href: "/executive/attendance",
          icon: "events",
        },
        {
          label: "Scan Attendance",
          href: "/executive/attendance/scan",
          icon: "membership",
        },
        {
          label: "Attendance Records",
          href: "/executive/attendance/records",
          icon: "reports",
        },
      ],
    },
    {
      id: "communication",
      label: "Communication",
      items: [
        {
          label: "Announcements",
          href: "/executive/communication/announcements",
          icon: "content",
        },
        {
          label: "Notifications",
          href: "/executive/communication/notifications",
          icon: "communication",
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      items: [
        {
          label: "Executive Reports",
          href: "/executive/reports",
          icon: "reports",
        },
        {
          label: "Participation Reports",
          href: "/executive/reports/participation",
          icon: "reports",
        },
      ],
    },
    {
      id: "account",
      label: "Account",
      items: [
        {
          label: "Profile",
          href: "/executive/account/profile",
          icon: "account",
        },
        {
          label: "Settings",
          href: "/executive/account/settings",
          icon: "account",
        },
        {
          label: "Security",
          href: "/executive/account/security",
          icon: "account",
        },
      ],
    },
  ];
}

function getAdministrationSections(): NavSection[] {
  return [
    {
      id: "dashboard-intelligence",
      label: "Dashboard & Intelligence",
      items: [
        {
          label: "Executive Dashboard",
          href: "/administration/dashboard",
          icon: "dashboard",
        },
        {
          label: "Overview",
          href: "/administration/dashboard/overview",
          icon: "dashboard",
        },
        {
          label: "Quick Statistics",
          href: "/administration/dashboard/statistics",
          icon: "reports",
        },
        {
          label: "Reports & Analytics",
          href: "/administration/dashboard/analytics",
          icon: "reports",
        },
        {
          label: "Recent Activities",
          href: "/administration/dashboard/activity",
          icon: "reports",
        },
        {
          label: "Alerts",
          href: "/administration/dashboard/alerts",
          icon: "communication",
        },
        {
          label: "Notifications",
          href: "/administration/notifications",
          icon: "communication",
        },
      ],
    },
    {
      id: "membership",
      label: "Membership",
      items: [
        {
          label: "Membership Dashboard",
          href: "/administration/membership",
          icon: "membership",
        },
        {
          label: "All Members",
          href: "/administration/members",
          icon: "users",
        },
        {
          label: "Students",
          href: "/administration/membership/students",
          icon: "users",
        },
        {
          label: "Alumni",
          href: "/administration/membership/alumni",
          icon: "users",
        },
        {
          label: "Lecturers",
          href: "/administration/membership/lecturers",
          icon: "users",
        },
        {
          label: "Pending Applications",
          href: "/administration/membership/pending",
          icon: "membership",
        },
        {
          label: "Active Members",
          href: "/administration/membership/active",
          icon: "membership",
        },
        {
          label: "Expired Members",
          href: "/administration/membership/expired",
          icon: "membership",
        },
        {
          label: "Suspended Members",
          href: "/administration/membership/suspended",
          icon: "membership",
        },
        {
          label: "Membership Activation",
          href: "/administration/membership/activation",
          icon: "membership",
        },
        {
          label: "Membership Migration",
          href: "/administration/membership/migration",
          icon: "membership",
        },
        {
          label: "Membership Renewal",
          href: "/administration/membership/renewal",
          icon: "membership",
        },
        {
          label: "Membership Cards",
          href: "/administration/membership/cards",
          icon: "membership",
        },
        {
          label: "Member Verification",
          href: "/administration/membership/verification",
          icon: "membership",
        },
        {
          label: "Member Requests",
          href: "/administration/membership/requests",
          icon: "services",
        },
        {
          label: "Member Documents",
          href: "/administration/membership/documents",
          icon: "content",
        },
        {
          label: "Membership History",
          href: "/administration/membership/history",
          icon: "reports",
        },
      ],
    },
    {
      id: "governance",
      label: "Governance & Leadership",
      items: [
        {
          label: "Governance Dashboard",
          href: "/administration/governance",
          icon: "leadership",
        },
        {
          label: "Executive Committee",
          href: "/administration/governance/executive",
          icon: "leadership",
        },
        {
          label: "Office Bearers",
          href: "/administration/governance/office-bearers",
          icon: "leadership",
        },
        {
          label: "Positions",
          href: "/administration/governance/positions",
          icon: "leadership",
        },
        {
          label: "Terms of Office",
          href: "/administration/governance/terms",
          icon: "leadership",
        },
        {
          label: "Committees",
          href: "/administration/governance/committees",
          icon: "leadership",
        },
        {
          label: "Meetings",
          href: "/administration/governance/meetings",
          icon: "events",
        },
        {
          label: "Agendas",
          href: "/administration/governance/agendas",
          icon: "content",
        },
        {
          label: "Meeting Attendance",
          href: "/administration/governance/attendance",
          icon: "events",
        },
        {
          label: "Minutes",
          href: "/administration/governance/minutes",
          icon: "content",
        },
        {
          label: "Resolutions",
          href: "/administration/governance/resolutions",
          icon: "content",
        },
        {
          label: "Action Items",
          href: "/administration/governance/actions",
          icon: "reports",
        },
        {
          label: "Governance Records",
          href: "/administration/governance/records",
          icon: "content",
        },
      ],
    },
    {
      id: "secretariat",
      label: "Secretariat",
      items: [
        {
          label: "Secretariat Dashboard",
          href: "/administration/secretariat",
          icon: "secretariat",
        },
        {
          label: "Correspondence",
          href: "/administration/secretariat/correspondence",
          icon: "secretariat",
        },
        {
          label: "Incoming Correspondence",
          href: "/administration/secretariat/incoming",
          icon: "secretariat",
        },
        {
          label: "Outgoing Correspondence",
          href: "/administration/secretariat/outgoing",
          icon: "secretariat",
        },
        {
          label: "Official Letters",
          href: "/administration/secretariat/letters",
          icon: "content",
        },
        {
          label: "Notices",
          href: "/administration/secretariat/notices",
          icon: "communication",
        },
        {
          label: "Administrative Requests",
          href: "/administration/secretariat/requests",
          icon: "services",
        },
        {
          label: "Secretariat Documents",
          href: "/administration/secretariat/documents",
          icon: "content",
        },
        {
          label: "Secretariat Reports",
          href: "/administration/secretariat/reports",
          icon: "reports",
        },
      ],
    },
    {
      id: "events",
      label: "Events & Activities",
      items: [
        {
          label: "Events Dashboard",
          href: "/administration/events",
          icon: "events",
        },
        {
          label: "Events",
          href: "/administration/events/all",
          icon: "events",
        },
        {
          label: "Activities",
          href: "/administration/activities",
          icon: "activities",
        },
        {
          label: "Event Registration",
          href: "/administration/events/registration",
          icon: "events",
        },
        {
          label: "Activity Registration",
          href: "/administration/activities/registration",
          icon: "activities",
        },
        {
          label: "Attendance",
          href: "/administration/events/attendance",
          icon: "events",
        },
        {
          label: "QR Check-in",
          href: "/administration/events/qr-check-in",
          icon: "membership",
        },
        {
          label: "Venues",
          href: "/administration/events/venues",
          icon: "events",
        },
        {
          label: "Participants",
          href: "/administration/events/participants",
          icon: "users",
        },
        {
          label: "Event Logistics",
          href: "/administration/events/logistics",
          icon: "events",
        },
        {
          label: "Event Tasks",
          href: "/administration/events/tasks",
          icon: "reports",
        },
        {
          label: "Event Documents",
          href: "/administration/events/documents",
          icon: "content",
        },
        {
          label: "Event Reports",
          href: "/administration/events/reports",
          icon: "reports",
        },
      ],
    },
    {
      id: "finance",
      label: "Finance & Payments",
      items: [
        {
          label: "Finance Dashboard",
          href: "/administration/finance",
          icon: "finance",
        },
        {
          label: "Membership Fees",
          href: "/administration/finance/fees",
          icon: "finance",
        },
        {
          label: "Payments",
          href: "/administration/finance/payments",
          icon: "finance",
        },
        {
          label: "Payment History",
          href: "/administration/finance/history",
          icon: "finance",
        },
        {
          label: "M-Pesa Transactions",
          href: "/administration/finance/mpesa",
          icon: "finance",
        },
        {
          label: "Payment Reconciliation",
          href: "/administration/finance/reconciliation",
          icon: "finance",
        },
        {
          label: "Receipts",
          href: "/administration/finance/receipts",
          icon: "content",
        },
        {
          label: "Refunds",
          href: "/administration/finance/refunds",
          icon: "finance",
        },
        {
          label: "Expenses",
          href: "/administration/finance/expenses",
          icon: "finance",
        },
        {
          label: "Budgets",
          href: "/administration/finance/budgets",
          icon: "reports",
        },
        {
          label: "Financial Ledger",
          href: "/administration/finance/ledger",
          icon: "finance",
        },
        {
          label: "Financial Reports",
          href: "/administration/finance/reports",
          icon: "reports",
        },
      ],
    },
    {
      id: "elections",
      label: "Elections",
      items: [
        {
          label: "Elections Dashboard",
          href: "/administration/elections",
          icon: "elections",
        },
        {
          label: "Elections",
          href: "/administration/elections/all",
          icon: "elections",
        },
        {
          label: "Election Positions",
          href: "/administration/elections/positions",
          icon: "elections",
        },
        {
          label: "Candidates",
          href: "/administration/elections/candidates",
          icon: "users",
        },
        {
          label: "Eligibility",
          href: "/administration/elections/eligibility",
          icon: "elections",
        },
        {
          label: "Voter Register",
          href: "/administration/elections/voters",
          icon: "users",
        },
        {
          label: "Voting",
          href: "/administration/elections/voting",
          icon: "elections",
        },
        {
          label: "Results",
          href: "/administration/elections/results",
          icon: "reports",
        },
        {
          label: "Election Reports",
          href: "/administration/elections/reports",
          icon: "reports",
        },
        {
          label: "Election Audit",
          href: "/administration/elections/audit",
          icon: "reports",
        },
      ],
    },
    {
      id: "content",
      label: "Content & Publicity",
      items: [
        {
          label: "Content Dashboard",
          href: "/administration/content",
          icon: "content",
        },
        {
          label: "Homepage",
          href: "/administration/content/homepage",
          icon: "content",
        },
        {
          label: "Pages",
          href: "/administration/content/pages",
          icon: "content",
        },
        {
          label: "News",
          href: "/administration/content/news",
          icon: "content",
        },
        {
          label: "Announcements",
          href: "/administration/content/announcements",
          icon: "communication",
        },
        {
          label: "Articles",
          href: "/administration/content/articles",
          icon: "content",
        },
        {
          label: "Events Content",
          href: "/administration/content/events",
          icon: "events",
        },
        {
          label: "Activities Content",
          href: "/administration/content/activities",
          icon: "activities",
        },
        {
          label: "Media Library",
          href: "/administration/content/media",
          icon: "content",
        },
        {
          label: "Gallery",
          href: "/administration/content/gallery",
          icon: "content",
        },
        {
          label: "Banners",
          href: "/administration/content/banners",
          icon: "content",
        },
        {
          label: "Social Content",
          href: "/administration/content/social",
          icon: "communication",
        },
        {
          label: "Publishing",
          href: "/administration/content/publishing",
          icon: "content",
        },
      ],
    },
    {
      id: "communication",
      label: "Communication",
      items: [
        {
          label: "Communication Dashboard",
          href: "/administration/communication",
          icon: "communication",
        },
        {
          label: "Notifications",
          href: "/administration/notifications",
          icon: "communication",
        },
        {
          label: "Messages",
          href: "/administration/communication/messages",
          icon: "communication",
        },
        {
          label: "Member Communications",
          href: "/administration/communication/members",
          icon: "communication",
        },
        {
          label: "Email",
          href: "/administration/communication/email",
          icon: "communication",
        },
        {
          label: "SMS",
          href: "/administration/communication/sms",
          icon: "communication",
        },
        {
          label: "Templates",
          href: "/administration/communication/templates",
          icon: "content",
        },
        {
          label: "Campaigns",
          href: "/administration/communication/campaigns",
          icon: "communication",
        },
        {
          label: "Communication History",
          href: "/administration/communication/history",
          icon: "reports",
        },
      ],
    },
    {
      id: "resources",
      label: "Resources & Documents",
      items: [
        {
          label: "Resource Library",
          href: "/administration/resources",
          icon: "content",
        },
        {
          label: "Documents",
          href: "/administration/resources/documents",
          icon: "content",
        },
        {
          label: "Downloads",
          href: "/administration/resources/downloads",
          icon: "content",
        },
        {
          label: "Certificates",
          href: "/administration/resources/certificates",
          icon: "content",
        },
        {
          label: "Certificate Verification",
          href: "/administration/resources/certificates/verification",
          icon: "membership",
        },
        {
          label: "Member Documents",
          href: "/administration/resources/member-documents",
          icon: "content",
        },
        {
          label: "Templates",
          href: "/administration/resources/templates",
          icon: "content",
        },
        {
          label: "Document Categories",
          href: "/administration/resources/categories",
          icon: "content",
        },
      ],
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      items: [
        {
          label: "Membership Reports",
          href: "/administration/reports/membership",
          icon: "reports",
        },
        {
          label: "Finance Reports",
          href: "/administration/reports/finance",
          icon: "reports",
        },
        {
          label: "Payment Reports",
          href: "/administration/reports/payments",
          icon: "reports",
        },
        {
          label: "Event Reports",
          href: "/administration/reports/events",
          icon: "reports",
        },
        {
          label: "Activity Reports",
          href: "/administration/reports/activities",
          icon: "reports",
        },
        {
          label: "Election Reports",
          href: "/administration/reports/elections",
          icon: "reports",
        },
        {
          label: "Communication Reports",
          href: "/administration/reports/communication",
          icon: "reports",
        },
        {
          label: "Membership Analytics",
          href: "/administration/reports/analytics",
          icon: "reports",
        },
        {
          label: "Custom Reports",
          href: "/administration/reports/custom",
          icon: "reports",
        },
      ],
    },
    {
      id: "access",
      label: "User & Access Management",
      items: [
        {
          label: "Users",
          href: "/administration/users",
          icon: "users",
        },
        {
          label: "Roles",
          href: "/administration/access/roles",
          icon: "users",
        },
        {
          label: "Permissions",
          href: "/administration/access/permissions",
          icon: "users",
        },
        {
          label: "Position Assignments",
          href: "/administration/access/positions",
          icon: "leadership",
        },
        {
          label: "Access Rules",
          href: "/administration/access/rules",
          icon: "system",
        },
        {
          label: "Delegated Access",
          href: "/administration/access/delegated",
          icon: "users",
        },
        {
          label: "Access Reviews",
          href: "/administration/access/reviews",
          icon: "reports",
        },
        {
          label: "Access Logs",
          href: "/administration/access/logs",
          icon: "reports",
        },
      ],
    },
    {
      id: "ict",
      label: "ICT & System Services",
      items: [
        {
          label: "ICT Dashboard",
          href: "/administration/ict",
          icon: "ict",
        },
        {
          label: "Website Management",
          href: "/administration/ict/website",
          icon: "content",
        },
        {
          label: "Technical Support",
          href: "/administration/ict/support",
          icon: "services",
        },
        {
          label: "Camera & Scanning",
          href: "/administration/ict/scanning",
          icon: "membership",
        },
        {
          label: "QR Code Management",
          href: "/administration/ict/qr",
          icon: "membership",
        },
        {
          label: "QR Verification",
          href: "/administration/ict/qr-verification",
          icon: "membership",
        },
        {
          label: "Integrations",
          href: "/administration/ict/integrations",
          icon: "ict",
        },
        {
          label: "System Health",
          href: "/administration/ict/health",
          icon: "ict",
        },
        {
          label: "Backups",
          href: "/administration/ict/backups",
          icon: "system",
        },
        {
          label: "Technical Logs",
          href: "/administration/ict/logs",
          icon: "reports",
        },
      ],
    },
    {
      id: "system",
      label: "System Administration",
      items: [
        {
          label: "System Dashboard",
          href: "/administration/system",
          icon: "system",
        },
        {
          label: "Super Administrators",
          href: "/administration/system/super-administrators",
          icon: "users",
        },
        {
          label: "Administrator Accounts",
          href: "/administration/system/administrators",
          icon: "users",
        },
        {
          label: "System Configuration",
          href: "/administration/system/configuration",
          icon: "system",
        },
        {
          label: "Security",
          href: "/administration/system/security",
          icon: "system",
        },
        {
          label: "Database",
          href: "/administration/system/database",
          icon: "system",
        },
        {
          label: "Maintenance",
          href: "/administration/system/maintenance",
          icon: "system",
        },
        {
          label: "Audit Logs",
          href: "/administration/system/audit",
          icon: "reports",
        },
        {
          label: "System Settings",
          href: "/administration/system/settings",
          icon: "system",
        },
        {
          label: "System Health",
          href: "/administration/system/health",
          icon: "ict",
        },
      ],
    },
  ];
}

function getPortalSections(
  portal: PortalType,
): NavSection[] {
  switch (portal) {
    case "member":
      return getMemberSections();

    case "executive":
      return getExecutiveSections();

    case "administration":
      return getAdministrationSections();

    default:
      return [];
  }
}

function getInitials(user: AuthUser) {
  const name =
    user.member?.memberNumber ||
    user.email.split("@")[0] ||
    "";

  const parts = name
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return (
    name.slice(0, 2).toUpperCase() ||
    "KU"
  );
}

function isPathActive(
  pathname: string,
  href: string,
) {
  if (
    href === "/dashboard" ||
    href === "/executive/dashboard" ||
    href === "/administration/dashboard"
  ) {
    return pathname === href;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

function Icon({
  type,
}: {
  type: IconType;
}) {
  const common =
    "h-[18px] w-[18px] shrink-0";

  switch (type) {
    case "dashboard":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "membership":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21c.8-4 3-6 7-6s6.2 2 7 6" />
        </svg>
      );

    case "finance":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h4" />
        </svg>
      );

    case "events":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4M17 3v4M3 10h18" />
          <path d="M8 14h3M8 17h3M14 14h3" />
        </svg>
      );

    case "activities":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 17.5 9 12l3 3 8-9" />
          <path d="M16 6h4v4" />
          <path d="M4 21h16" />
        </svg>
      );

    case "elections":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M7 4h10v5H7z" />
          <path d="M5 9h14v11H5z" />
          <path d="m9 14 2 2 4-5" />
        </svg>
      );

    case "content":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" />
          <path d="M4 5.5v13" />
          <path d="M8 7h8M8 10h8M8 13h5" />
        </svg>
      );

    case "communication":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 5h16v11H8l-4 4z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );

    case "services":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8v4l2.5 2.5" />
        </svg>
      );

    case "account":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 21c.9-4 3.1-6 7-6s6.1 2 7 6" />
        </svg>
      );

    case "users":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20c.7-3.5 2.5-5.5 5.5-5.5s4.8 2 5.5 5.5" />
          <path d="M16 5.5a3 3 0 0 1 0 5.5" />
          <path d="M17 14.5c1.9.6 3.1 2.3 3.5 4.5" />
        </svg>
      );

    case "leadership":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="7" r="3" />
          <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
          <path d="M18 4.5 20 6l-.5 2.2" />
        </svg>
      );

    case "secretariat":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 6h16v14H4z" />
          <path d="M7 3h10v3H7z" />
          <path d="M8 10h8M8 13h8M8 16h5" />
        </svg>
      );

    case "reports":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 20V10M12 20V4M19 20v-7" />
        </svg>
      );

    case "ict":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 21h8M12 18v3" />
        </svg>
      );

    case "system":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.1A1.7 1.7 0 0 0 7.6 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.2l.1.1A1.7 1.7 0 0 0 11 6a1.7 1.7 0 0 0 1-1.5V4h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.1 1z" />
        </svg>
      );
  }
}

export default function DashboardSidebar({
  portal,
  user,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const sections = useMemo(
    () => getPortalSections(portal),
    [portal],
  );

  const [
    userOpenedSection,
    setUserOpenedSection,
  ] = useState<string | null>(null);

  const activeSectionId =
    sections.find((section) =>
      section.items.some((item) =>
        isPathActive(
          pathname,
          item.href,
        ),
      ),
    )?.id ?? null;

  const openSection =
    userOpenedSection ?? activeSectionId;

  const initials = getInitials(user);

  const portalLabel =
    portal === "member"
      ? "Member Portal"
      : portal === "executive"
        ? "Executive Portal"
        : "Administration";

  const dashboardHome =
    portal === "member"
      ? "/dashboard"
      : portal === "executive"
        ? "/executive/dashboard"
        : "/administration/dashboard";

  const handleSectionToggle = (
    sectionId: string,
  ) => {
    setUserOpenedSection((current) =>
      current === sectionId
        ? null
        : sectionId,
    );
  };

  const handleNavigation = (
    sectionId: string,
  ) => {
    setUserOpenedSection(sectionId);
    onCloseMobile();
  };

  const sidebar = (
    <aside className="flex h-screen w-[290px] flex-col border-r border-white/10 bg-[#0B2633] text-white">
      <div className="shrink-0 border-b border-white/10 px-5 py-5">
        <Link
          href={dashboardHome}
          onClick={onCloseMobile}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
            <Image
              src="/images/kuhrsa_logo.jpeg"
              alt="KUHRSA official logo"
              width={44}
              height={44}
              className="h-full w-full object-contain p-1"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="text-base font-black tracking-tight">
              KUHRSA
            </p>

            <p className="mt-0.5 truncate text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
              {portalLabel}
            </p>
          </div>
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <nav className="space-y-2">
          {sections.map((section) => {
            const sectionOpen =
              openSection === section.id;

            const sectionActive =
              section.items.some((item) =>
                isPathActive(
                  pathname,
                  item.href,
                ),
              );

            return (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() =>
                    handleSectionToggle(
                      section.id,
                    )
                  }
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                    sectionActive
                      ? "bg-white/[0.07] text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
                  aria-expanded={sectionOpen}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        sectionActive
                          ? "bg-[#168DB8]"
                          : "bg-white/20"
                      }`}
                    />

                    <span className="truncate text-[11px] font-black uppercase tracking-[0.12em]">
                      {section.label}
                    </span>
                  </span>

                  <svg
                    className={`h-4 w-4 shrink-0 text-white/35 transition-transform ${
                      sectionOpen
                        ? "rotate-180"
                        : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <div
                  className={`grid transition-all duration-200 ${
                    sectionOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-2">
                      {section.items.map(
                        (item) => {
                          const active =
                            isPathActive(
                              pathname,
                              item.href,
                            );

                          return (
                            <Link
                              key={`${section.id}-${item.href}`}
                              href={item.href}
                              onClick={() =>
                                handleNavigation(
                                  section.id,
                                )
                              }
                              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                active
                                  ? "bg-[#168DB8] text-white shadow-lg shadow-[#168DB8]/20"
                                  : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                              }`}
                            >
                              <Icon
                                type={item.icon}
                              />

                              <span className="min-w-0 flex-1 truncate">
                                {item.label}
                              </span>

                              {active && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                              )}
                            </Link>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-[#0B2633]">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">
              {user.email}
            </p>

            <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
              {user.isSystemOwner
                ? "System Owner"
                : user.roles
                    .map(
                      (role) =>
                        role.name,
                    )
                    .join(", ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white"
        >
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 5v14a2 2 0 0 1-2 2h-5" />
          </svg>

          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {sidebar}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-[#0B2633]/60 backdrop-blur-sm"
          />

          <div className="relative h-full">
            {sidebar}

            <button
              type="button"
              aria-label="Close navigation"
              onClick={onCloseMobile}
              className="absolute right-3 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
