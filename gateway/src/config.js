export const config = {
  port: parseInt(process.env.GATEWAY_PORT || "8080"),
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  projectServiceUrl: process.env.PROJECT_SERVICE_URL || "http://localhost:3002",
  revisionServiceUrl: process.env.REVISION_SERVICE_URL || "http://localhost:3003",
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3004",
  fileServiceUrl: process.env.FILE_SERVICE_URL || "http://localhost:3005",
  emailServiceUrl: process.env.EMAIL_SERVICE_URL || "http://localhost:3006",
  dashboardServiceUrl: process.env.DASHBOARD_SERVICE_URL || "http://localhost:3007",
};
