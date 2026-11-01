import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import "./index.css";
import PageLoader from "./components/PageLoader";
import { useTheme } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import { Toaster } from "react-hot-toast";

// ✅ Lazy Loading برای همه صفحات
const Navbar = lazy(() => import("./components/Navbar"));
const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const AboutPage = lazy(() => import("./Pages/AboutPage"));
const Footer = lazy(() => import("./components/Footer"));
const Register = lazy(() => import("./Pages/Register"));
const AdminLogin = lazy(() => import("./Pages/admin/AdminLogin"));
const DashboardStats = lazy(() => import("./Pages/admin/DashboardStats"));
const AdminProjects = lazy(() => import("./Pages/admin/AdminProjects"));
const AdminCertificates = lazy(() => import("./Pages/admin/AdminCertificates"));
const AdminMessages = lazy(() => import("./Pages/admin/AdminMessages"));
const AdminComments = lazy(() => import("./Pages/admin/AdminComments"));
const AdminProjectComments = lazy(() => import("./Pages/admin/AdminProjectComments"));
const AdminUsers = lazy(() => import("./Pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./Pages/admin/AdminSettings"));
const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/ContactPage"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
const NotFoundPage = lazy(() => import("./Pages/404"));
const AnimatedBackground = lazy(() => import("./components/Background"));

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={<PageLoader />}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <Suspense fallback={<PageLoader />}>
          <Navbar />
          <Home />
          <About />
          <Portofolio />
          <ContactPage />
          <Footer />
        </Suspense>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <Suspense fallback={<PageLoader />}>
    <Navbar />
    <ProjectDetails />
    <Footer />
  </Suspense>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme === "dark" ? "dark" : "light",
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <HelmetProvider>
        <Suspense fallback={<PageLoader />}>
          <AnimatedBackground />
        </Suspense>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />}
              />
              <Route path="/about" element={
                <Suspense fallback={<PageLoader />}>
                  <Navbar />
                  <AboutPage />
                  <Footer />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<PageLoader />}>
                  <Navbar />
                  <ContactPage />
                  <Footer />
                </Suspense>
              } />
              <Route path="/project/:slug" element={<ProjectPageLayout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* ADMIN ROUTES */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <DashboardStats />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <AdminProjects />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/certificates"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <AdminCertificates />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <AdminMessages />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/comments"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <AdminComments />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/project-comments"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <AdminProjectComments />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <AdminUsers />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout>
                        <AdminSettings />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route path="/Navbar" element={<Navbar />} />
              <Route path="/Footer" element={<Footer />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === "dark" ? "#1e1b4b" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#1f2937",
              border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </HelmetProvider>
    </MuiThemeProvider>
  );
}

export default App;