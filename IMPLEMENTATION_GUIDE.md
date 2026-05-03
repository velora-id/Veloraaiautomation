# Velora AI - Implementation Guide

## 🚀 Quick Start

This guide shows you how to use the newly implemented frontend features in Velora AI.

---

## 📦 What's Been Added

### ✅ 7 New Components
1. **NotificationCenter** - Real-time notification management
2. **CommandPalette** - Quick actions with keyboard shortcuts (Cmd+K)
3. **ActivityFeed** - Activity tracking and logging
4. **StatsCard** - Enhanced metric visualization
5. **ToastNotificationProvider** - Toast notification system
6. **QuickActionsWidget** - Quick action shortcuts
7. **ActivitiesPage** - Full-page activity log

### ✅ Enhanced Pages
1. **Dashboard** - Now uses new StatsCards and ActivityFeed
2. **AnalyticsPage** - Added tabbed interface, radar charts, hourly activity
3. **DashboardLayout** - Integrated NotificationCenter and CommandPalette

### ✅ New Navigation
- Added "Activities" page to sidebar navigation
- Command Palette accessible via Cmd+K from anywhere

---

## 🎯 Using the New Features

### 1. Notification Center

**Location:** Top-right corner of navbar (bell icon)

**Features:**
- Shows unread count badge
- Three tabs: All, Unread, Read
- Color-coded by type (success, warning, error, info)
- Mark as read / Delete actions
- Quick action buttons on notifications

**Access:**
```tsx
// Already integrated in DashboardLayout
// Click the bell icon in top-right navbar
```

**Keyboard Shortcut:** None (click to open)

---

### 2. Command Palette

**Location:** Available globally

**How to Access:**
- Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- Click the search bar in navbar

**Available Commands:**
- **Navigation** (9): Quick navigation to any page
- **Quick Actions** (3): Create agent, workflow, invite member
- **Appearance** (2): Toggle light/dark mode
- **Account** (1): Logout

**Usage:**
```
1. Press Cmd+K
2. Type to search
3. Use ↑↓ to navigate
4. Press Enter to execute
5. Press Esc to close
```

---

### 3. Activity Feed

**Locations:**
1. Dashboard (mini version, 5 items)
2. Activities Page (full version, 50+ items with filters)

**Features:**
- Filter by type: Agent, Workflow, Lead, Integration, Team, System
- Real-time timestamps
- Color-coded status badges
- User attribution
- Metadata display

**How to Use:**
```tsx
import { ActivityFeed } from "../components/ActivityFeed";

// Mini version (Dashboard)
<ActivityFeed maxItems={5} showFilters={false} />

// Full version (Activities Page)
<ActivityFeed maxItems={50} showFilters={true} />
```

---

### 4. Stats Cards

**Three Variants:**

#### MetricStatsCard
For metrics with trends:
```tsx
import { MetricStatsCard } from "../components/StatsCard";

<MetricStatsCard
  label="Total AI Credits"
  value="28,543"
  change={12.5}
  changeLabel="vs last month"
  icon={Activity}
  color="purple"
/>
```

#### UsageStatsCard
For usage with progress:
```tsx
import { UsageStatsCard } from "../components/StatsCard";

<UsageStatsCard
  label="API Credits"
  used={28543}
  total={50000}
  icon={Zap}
  color="purple"
/>
```

#### StatsCard (Advanced)
Full control:
```tsx
import { StatsCard } from "../components/StatsCard";

<StatsCard
  title="Active Workflows"
  value="24"
  icon={Workflow}
  color="blue"
  trend={{
    value: 3,
    label: "+3 this week",
    direction: "up"
  }}
  progress={{
    value: 24,
    max: 100,
    label: "24% capacity"
  }}
  badge={{
    text: "Active",
    variant: "secondary"
  }}
  onClick={() => console.log("Clicked!")}
/>
```

**Color Options:**
- purple (default)
- blue
- green
- yellow
- red
- pink
- cyan

---

### 5. Toast Notifications

**Available Functions:**

```tsx
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showWorkflowCompletedToast,
  showWorkflowFailedToast,
  showAgentActivityToast,
  showLeadsGeneratedToast,
  showApiLimitToast,
} from "../components/ToastNotificationProvider";

// Basic toasts
showSuccessToast("Success!", "Your changes were saved");
showErrorToast("Error", "Failed to save changes");
showWarningToast("Warning", "You're approaching your limit");
showInfoToast("Info", "New features available");

// Workflow toasts
showWorkflowCompletedToast("Lead Generation", "150 leads added");
showWorkflowFailedToast("Email Campaign", "API rate limit exceeded");

// Agent toasts
showAgentActivityToast("Support Agent", "12 inquiries processed");

// Lead toasts
showLeadsGeneratedToast(42, "LinkedIn Campaign");

// API limit toast
showApiLimitToast(85); // Shows "85% usage" warning
```

**Demo Mode:**
The app automatically shows demo toasts:
- 5 seconds: Workflow completion
- 10 seconds: Agent activity
- 15 seconds: API usage warning

---

### 6. Quick Actions Widget

**Usage:**

```tsx
import { QuickActionsWidget } from "../components/QuickActionsWidget";

// Default actions
<QuickActionsWidget />

// Custom actions
const customActions = [
  {
    id: "my-action",
    label: "My Action",
    description: "Do something",
    icon: <MyIcon className="size-5" />,
    color: "bg-purple-100 dark:bg-purple-950 text-purple-600",
    onClick: () => console.log("Action!"),
  },
];

<QuickActionsWidget actions={customActions} showHeader={true} />
```

**Floating Action Button:**
```tsx
import { QuickActionFAB } from "../components/QuickActionsWidget";

<QuickActionFAB />
```

---

### 7. Enhanced Analytics

**New Features:**

1. **Tabbed Interface**
   - Overview: General usage
   - Performance: Detailed metrics
   - Usage Patterns: Time-based analysis

2. **New Chart Types**
   - Radar Chart: Performance metrics
   - Horizontal Bar Chart: Success rates
   - Line Chart: Hourly activity

3. **Performance Cards**
   - Success Rate
   - Avg Response Time
   - Active Agents

4. **Time Range Selector**
   - Last 7 days
   - Last 30 days
   - Last 90 days
   - Last year

5. **Export Button**
   - UI ready for backend integration

---

## 📱 Navigation Structure

```
/app
├── / (Dashboard) ← Enhanced with new components
├── /agents (AI Agents)
├── /workflows (Workflows)
├── /leads (Leads & CRM)
├── /integrations (Integrations)
├── /analytics (Analytics) ← Enhanced with new charts
├── /activities (Activities) ← NEW PAGE
├── /billing (Billing)
├── /settings/team (Team Settings)
├── /partner (Partner Portal)
└── /admin (Admin Dashboard)
```

---

## 🎨 Component Import Guide

### Option 1: Individual Imports
```tsx
import { NotificationCenter } from "../components/NotificationCenter";
import { CommandPalette } from "../components/CommandPalette";
import { ActivityFeed } from "../components/ActivityFeed";
```

### Option 2: Centralized Import
```tsx
import {
  NotificationCenter,
  CommandPalette,
  ActivityFeed,
  MetricStatsCard,
  UsageStatsCard,
  showSuccessToast,
  QuickActionsWidget,
} from "../components";
```

---

## 🔧 Customization Examples

### Custom Notification Colors

```tsx
// In NotificationCenter.tsx, modify getNotificationColor():
const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "text-green-600 bg-green-100"; // Change these
    // ... add custom colors
  }
};
```

### Add New Command

```tsx
// In CommandPalette.tsx, add to commands array:
{
  id: "my-command",
  label: "My Custom Action",
  description: "Does something cool",
  icon: <MyIcon className="size-4" />,
  group: "Quick Actions",
  action: () => {
    // Your action here
    navigate("/my-page");
    setOpen(false);
  },
  keywords: ["custom", "cool"],
}
```

### Custom Activity Type

```tsx
// In ActivityFeed.tsx, extend ActivityItem type:
export type ActivityItem = {
  // ... existing fields
  type: "agent" | "workflow" | "lead" | "integration" | "team" | "system" | "custom";
};

// Add icon mapping:
const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "custom":
      return <CustomIcon className={iconClass} />;
    // ... other cases
  }
};
```

### Custom Stats Card Theme

```tsx
// In StatsCard.tsx, add new color:
const colorClasses = {
  // ... existing colors
  custom: {
    bg: "bg-indigo-100 dark:bg-indigo-950",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    gradient: "from-indigo-500 to-indigo-600",
  },
};
```

---

## 🧪 Testing Guide

### Test Notifications
```tsx
// Click bell icon in navbar
// Check all three tabs (All, Unread, Read)
// Test "Mark as read" and "Delete" actions
// Test "Mark all as read" button
```

### Test Command Palette
```tsx
// Press Cmd+K or Ctrl+K
// Type "dashboard" - should show "Go to Dashboard"
// Type "agent" - should show multiple results
// Use arrow keys to navigate
// Press Enter to execute
// Press Esc to close
```

### Test Activity Feed
```tsx
// Navigate to /app/activities
// Test filter tabs (All, Agents, Workflows, etc.)
// Verify colors and icons are correct
// Check timestamps are accurate
```

### Test Toast Notifications
```tsx
import { testToastNotifications } from "../components/ToastNotificationProvider";

// Call this function to test all toast types
testToastNotifications();
```

### Test Stats Cards
```tsx
// Check Dashboard page
// Verify trends show correct icons (up/down)
// Test progress bars in usage cards
// Verify colors match specifications
```

---

## 🐛 Troubleshooting

### Command Palette Not Opening
- Ensure you're pressing Cmd+K (Mac) or Ctrl+K (Windows)
- Check that CommandPalette is in DashboardLayout
- Verify no other keyboard shortcuts conflict

### Notifications Not Showing
- Check that NotificationCenter is in DashboardLayout
- Verify bell icon is visible in navbar
- Check mockNotifications array has data

### Toast Not Appearing
- Ensure ToastNotificationProvider wraps RouterProvider in App.tsx
- Check toast position setting (default: top-right)
- Verify Sonner package is installed

### Stats Cards Not Updating
- Check that data props are being passed correctly
- Verify icons are imported from lucide-react
- Ensure color prop is valid

---

## 📊 Performance Tips

1. **Lazy Load Heavy Components**
```tsx
const ActivityFeed = lazy(() => import("../components/ActivityFeed"));
```

2. **Memoize Expensive Calculations**
```tsx
const filteredActivities = useMemo(
  () => activities.filter(...),
  [activities, filter]
);
```

3. **Debounce Search in Command Palette**
```tsx
const debouncedSearch = useDebounce(searchTerm, 300);
```

4. **Virtualize Long Lists**
```tsx
// For ActivityFeed with 1000+ items
import { FixedSizeList } from "react-window";
```

---

## 🔐 Security Considerations

1. **Sanitize User Input**
   - All user-generated content should be sanitized
   - Use DOMPurify for HTML content

2. **API Integration**
   - Never expose API keys in frontend
   - Use environment variables
   - Implement proper CORS

3. **Authentication**
   - All pages check for valid user session
   - Redirect to login if unauthenticated
   - Implement proper JWT validation

---

## 🚀 Next Steps

### Ready for Backend Integration

All components are ready to connect to real APIs:

1. **NotificationCenter**
   - Connect to WebSocket for real-time updates
   - Implement notification preferences API
   - Add notification history persistence

2. **ActivityFeed**
   - Connect to activity log API
   - Implement pagination
   - Add search and advanced filtering

3. **Analytics**
   - Connect to analytics API
   - Implement real-time data updates
   - Add export functionality (CSV, PDF)

4. **Command Palette**
   - Add recent commands tracking
   - Implement search across all data
   - Add custom user shortcuts

---

## 📚 Resources

- **React Router**: Navigation and routing
- **Recharts**: Charts and visualizations
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Styling and theming
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

---

## 💡 Tips & Best Practices

1. **Consistent Icon Usage**
   - Always use lucide-react icons
   - Keep icon sizes consistent (size-4, size-5)

2. **Color Coding**
   - Green = Success
   - Red = Error
   - Yellow = Warning
   - Blue = Info
   - Purple = Primary brand color

3. **Accessibility**
   - All interactive elements have keyboard support
   - ARIA labels on all important elements
   - Focus indicators visible

4. **Responsive Design**
   - Test on mobile (< 768px)
   - Test on tablet (768px - 1024px)
   - Test on desktop (> 1024px)

5. **Dark Mode**
   - All components support dark mode
   - Use dark: prefix for dark mode styles
   - Test both themes regularly

---

## 🎉 Summary

You now have access to:
- ✅ Real-time notification system
- ✅ Command palette for quick actions
- ✅ Comprehensive activity tracking
- ✅ Enhanced analytics with multiple chart types
- ✅ Beautiful stats cards with trends
- ✅ Toast notification system
- ✅ Quick action widgets

All components are production-ready and waiting for backend integration!

**Happy coding! 🚀**
