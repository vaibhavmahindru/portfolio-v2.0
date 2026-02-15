import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import PageTransition from "./components/PageTransition";

// Only the Index page is eagerly imported; all other routes are lazy
import Index from "./pages/Index";
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const SecretPage = lazy(() => import("./pages/SecretPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <PageTransition>
                <CaseStudy />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/secret"
          element={
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <PageTransition>
                <SecretPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <PageTransition>
                <SecretPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider>
      <BrowserRouter>
      <AnimatedRoutes />
      </BrowserRouter>
  </ThemeProvider>
);

export default App;
