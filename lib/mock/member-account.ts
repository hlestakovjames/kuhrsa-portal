export const memberAccountMock = {
  profile: {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.test",
    phone: "0700000000",
    programme: "Bachelor of Human Resource Management",
    yearOfStudy: 3,
    faculty: "School of Business and Economics",
    department: "Human Resource Management",
    registrationNumber: "REG-TEST-2026-001",
  },

  security: {
    passwordLastChanged: "01 September 2026",
    twoFactorEnabled: false,
    activeSessions: 2,
    securityStatus: "Good",
  },

  loginHistory: [
    {
      id: "login-001",
      date: "09 September 2026",
      time: "09:15 AM",
      device: "Windows Desktop",
      browser: "Microsoft Edge",
      location: "Kisii, Kenya",
      status: "Successful",
    },
    {
      id: "login-002",
      date: "08 September 2026",
      time: "07:42 PM",
      device: "Android Device",
      browser: "Chrome",
      location: "Kisii, Kenya",
      status: "Successful",
    },
    {
      id: "login-003",
      date: "06 September 2026",
      time: "11:20 AM",
      device: "Windows Desktop",
      browser: "Microsoft Edge",
      location: "Kisii, Kenya",
      status: "Successful",
    },
  ],

  settings: {
    language: "English",
    timezone: "Africa/Nairobi",
    dateFormat: "DD/MM/YYYY",
    dashboardDensity: "Comfortable",
  },
};
