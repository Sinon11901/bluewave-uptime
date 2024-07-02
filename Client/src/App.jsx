import { Routes, Route } from "react-router-dom";
// import "./App.css";
import NotFound from "./Pages/NotFound";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import HomeLayout from "./Layouts/HomeLayout";
import Demo from "./Pages/Demo/Demo";
import PlayGround from "./Pages/PlayGround/PlayGround";
import Account from "./Pages/Account";
import Monitors from "./Pages/Monitors";
import CreateNewMonitor from "./Pages/CreateNewMonitor";
import Incidents from "./Pages/Incidents";
import Status from "./Pages/Status";
import Integrations from "./Pages/Integrations";
import Settings from "./Pages/Settings";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import SetNewPassword from "./Pages/SetNewPassword";
import NewPasswordConfirmed from "./Pages/NewPasswordConfirmed";
import ToastComponent from "./Components/Toast";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
  const [adminExists, setAdminExists] = useState(false); // Assuming admin exists by default

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        // Replace this URL with your actual API endpoint
        const response = await axios.get(`${BASE_URL}/auth/users/admin`);
        console.log(response);
      } catch (error) {
        console.error("Failed to check admin existence:", error);
      }
    };

    checkAdminExists();
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<HomeLayout />}>
          <Route
            exact
            path="/"
            element={<ProtectedRoute Component={Monitors} />}
          />
          <Route
            path="/monitors"
            element={<ProtectedRoute Component={Monitors} />}
          />
          <Route
            path="/monitors/create"
            element={<ProtectedRoute Component={CreateNewMonitor} />}
          />
          <Route
            path="incidents"
            element={<ProtectedRoute Component={Incidents} />}
          />
          <Route
            path="status"
            element={<ProtectedRoute Component={Status} />}
          />
          <Route
            path="integrations"
            element={<ProtectedRoute Component={Integrations} />}
          />
          <Route
            path="settings"
            element={<ProtectedRoute Component={Settings} />}
          />
          <Route
            path="account/profile"
            element={<ProtectedRoute Component={Account} open="profile" />}
          />
          <Route
            path="account/password"
            element={<ProtectedRoute Component={Account} open="password" />}
          />
          <Route
            path="account/team"
            element={<ProtectedRoute Component={Account} open="team" />}
          />
        </Route>

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/demo" element={<Demo />} />
        {/* <Route path="/toast" element={<ToastComponent />} /> */}
        <Route path="*" element={<NotFound />} />
        <Route path="/playground" element={<PlayGround />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/set-new-password/:token" element={<SetNewPassword />} />
        <Route
          path="/new-password-confirmed"
          element={<NewPasswordConfirmed />}
        />
      </Routes>
    </>
  );
}

export default App;
