import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
import CaseStudy from "./pages/CaseStudy";
import SecretPage from "./pages/SecretPage";
import NotFound from "./pages/NotFound";

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
            <PageTransition>
              <CaseStudy />
            </PageTransition>
          }
        />
        <Route
          path="/secret"
          element={
            <PageTransition>
              <SecretPage />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <PageTransition>
              <SecretPage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
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
