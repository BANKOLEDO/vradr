import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toast } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingScreen } from "./components/LoadingScreen";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toast />
      <ErrorBoundary>
        <AuthLoading>
          <LoadingScreen />
        </AuthLoading>
        <Unauthenticated>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<AuthPage />} />
          </Routes>
        </Unauthenticated>
        <Authenticated>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Authenticated>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
