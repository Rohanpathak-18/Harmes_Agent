import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import useAuthStore from "./store/authStore";

import Loading from "./components/ui/Loading";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";

import Research from "./pages/research/Research";
import ContentPlan from "./pages/content/ContentPlan";
import Script from "./pages/content/Script";
import Production from "./pages/production/Production";
import ApprovalCenter from "./pages/approval/ApprovalCenter";
import PublishingQueue from "./pages/publishing/PublishingQueue";
import Analytics from "./pages/insights/Performance";
import Learning from "./pages/learning/Learning";
import Settings from "./pages/settings/Settings";

import "./App.css";

const ProtectedRoute = ({
  children,
}) => {
  const user = useAuthStore(
    (state) => state.user
  );

  const loading = useAuthStore(
    (state) => state.loading
  );

  if (loading) {
    return (
      <Loading
        text="Loading Hermes..."
        fullPage
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

const PublicRoute = ({
  children,
}) => {
  const user = useAuthStore(
    (state) => state.user
  );

  const loading = useAuthStore(
    (state) => state.loading
  );

  if (loading) {
    return (
      <Loading
        text="Loading..."
        fullPage
      />
    );
  }

  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

const App = () => {
  const initialize =
    useAuthStore(
      (state) => state.initialize
    );

  const clearUser =
    useAuthStore(
      (state) => state.clearUser
    );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleUnauthorized =
      () => {
        clearUser();
      };

    window.addEventListener(
      "hermes:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "hermes:unauthorized",
        handleUnauthorized
      );
    };
  }, [clearUser]);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <VerifyEmail />
          </PublicRoute>
        }
      />


      {/* PROTECTED APPLICATION */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/new"
          element={<CreateJob />}
        />

        <Route
          path="/jobs/:jobId"
          element={<JobDetails />}
        />

        <Route
          path="/research"
          element={<Research />}
        />

        <Route
          path="/content"
          element={<ContentPlan />}
        />

        <Route
          path="/content/script"
          element={<Script />}
        />

        <Route
          path="/production"
          element={<Production />}
        />

        <Route
          path="/approval"
          element={<ApprovalCenter />}
        />

        <Route
          path="/publishing"
          element={<PublishingQueue />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/learning"
          element={<Learning />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      {/* FALLBACK */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;
