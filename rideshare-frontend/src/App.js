import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateRidePage from "./pages/CreateRidePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import LandingPage
  from "./pages/LandingPage";
import ReviewsPage from "./pages/ReviewsPage";
import ProfilePage from "./pages/ProfilePage";
import DriverBookingsPage from "./pages/DriverBookingsPage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        <Route
          path="/reviews"
          element={<ReviewsPage />}
        />
        <Route
          path="/bookings"
          element={<MyBookingsPage />}
        />
        <Route
          path="/create-ride"
          element={<CreateRidePage />}
        />
        <Route
          path="/driver-bookings"
          element={<DriverBookingsPage />}
        />
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;