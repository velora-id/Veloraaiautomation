import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { AgentsPage } from "./pages/AgentsPage";
import { WorkflowsPage } from "./pages/WorkflowsPage";
import { LeadsPage } from "./pages/LeadsPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { BillingPage } from "./pages/BillingPage";
import { TeamSettingsPage } from "./pages/TeamSettingsPage";
import { PartnerPortalPage } from "./pages/PartnerPortalPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { PricingPage } from "./pages/PricingPage";
import { NotFound } from "./pages/NotFound";
import { ActivitiesPage } from "./pages/ActivitiesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/pricing",
    Component: PricingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/app",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "agents", Component: AgentsPage },
      { path: "workflows", Component: WorkflowsPage },
      { path: "leads", Component: LeadsPage },
      { path: "integrations", Component: IntegrationsPage },
      { path: "analytics", Component: AnalyticsPage },
      { path: "activities", Component: ActivitiesPage },
      { path: "billing", Component: BillingPage },
      { path: "settings/team", Component: TeamSettingsPage },
      { path: "partner", Component: PartnerPortalPage },
      { path: "admin", Component: AdminDashboardPage },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);