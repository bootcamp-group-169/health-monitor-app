import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./theme/theme";
import { useThemeStore } from "./store/themeStore";
import { useAuthStore } from "./store/authStore";
import { useHealthStore } from "./store/healthStore";
import { AuthPage } from "./pages/AuthPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { Dashboard } from "./pages/Dashboard";
import { AIAssistant } from "./pages/AIAssistant";
import { IntestinalTracker } from "./pages/IntestinalTracker";
import { MealTracker } from "./pages/MealTracker";
import { Navigation } from "./components/Navigation";
import { AnimatedBackground } from "./components/AnimatedBackground";

function App() {
  const { isDark } = useThemeStore();
  const { isAuthenticated, needsOnboarding } = useAuthStore();
  const { userProfile } = useHealthStore();

  const theme = isDark ? darkTheme : lightTheme;

  const AuthenticatedLayout = () => (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AnimatedBackground />
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          width: { xs: "100%", md: "calc(100% - 240px)" },
        }}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/intestinal-tracker" element={<IntestinalTracker />} />
          <Route path="/meal-tracker" element={<MealTracker />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage />
              )
            }
          />
          <Route
            path="/onboarding"
            element={
              isAuthenticated && needsOnboarding ? (
                <OnboardingPage />
              ) : isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/*"
            element={
              !isAuthenticated ? (
                <Navigate to="/auth" replace />
              ) : needsOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <AuthenticatedLayout />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
