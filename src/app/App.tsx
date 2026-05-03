import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";
import { ToastNotificationProvider } from "./components/ToastNotificationProvider";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <ToastNotificationProvider>
          <RouterProvider router={router} />
        </ToastNotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}