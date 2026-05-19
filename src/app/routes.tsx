import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./pages/LandingPage")).LandingPage,
    }),
  },
  {
    path: "/pricing",
    lazy: async () => ({
      Component: (await import("./pages/PricingPage")).PricingPage,
    }),
  },
  {
    path: "/investors",
    lazy: async () => ({
      Component: (await import("./pages/InvestorPage")).default,
    }),
  },
  {
    path: "/login",
    lazy: async () => ({
      Component: (await import("./pages/LoginPage")).LoginPage,
    }),
  },
  {
    path: "/register",
    lazy: async () => ({
      Component: (await import("./pages/RegisterPage")).RegisterPage,
    }),
  },
  {
    path: "/app",
    lazy: async () => ({
      Component: (await import("./layouts/DashboardLayout")).DashboardLayout,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/Dashboard")).Dashboard,
        }),
      },
      {
        path: "agents",
        lazy: async () => ({
          Component: (await import("./pages/AgentsPage")).AgentsPage,
        }),
      },
      {
        path: "workflows",
        lazy: async () => ({
          Component: (await import("./pages/WorkflowsPage")).WorkflowsPage,
        }),
      },
      {
        path: "leads",
        lazy: async () => ({
          Component: (await import("./pages/LeadsPage")).LeadsPage,
        }),
      },
      {
        path: "integrations",
        lazy: async () => ({
          Component: (await import("./pages/IntegrationsPage")).IntegrationsPage,
        }),
      },
      {
        path: "analytics",
        lazy: async () => ({
          Component: (await import("./pages/AnalyticsPage")).AnalyticsPage,
        }),
      },
      {
        path: "activities",
        lazy: async () => ({
          Component: (await import("./pages/ActivitiesPage")).ActivitiesPage,
        }),
      },
      {
        path: "billing",
        lazy: async () => ({
          Component: (await import("./pages/BillingPage")).BillingPage,
        }),
      },
      {
        path: "settings/team",
        lazy: async () => ({
          Component: (await import("./pages/TeamSettingsPage")).TeamSettingsPage,
        }),
      },
      {
        path: "partner",
        lazy: async () => ({
          Component: (await import("./pages/PartnerPortalPage")).PartnerPortalPage,
        }),
      },
      {
        path: "admin",
        lazy: async () => ({
          Component: (await import("./pages/AdminDashboardPage")).AdminDashboardPage,
        }),
      },
    ],
  },
  {
    path: "*",
    lazy: async () => ({
      Component: (await import("./pages/NotFound")).NotFound,
    }),
  },
]);
