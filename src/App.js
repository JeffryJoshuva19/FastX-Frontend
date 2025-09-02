import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OperatorApp from "./components/operator/App";
import AdminApp from "./components/admin/App";
import Login from "./components/login/login";
import Register from "./components/register/register";
import UserApp from "./components/user/App";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard (only for admins) */}
        <Route
          path="/admin/*"
          element={<ProtectedRoute element={<AdminApp />} allowedRoles={["Admin"]} />}
        />
        {/* BusOperator Dashboard */}
        <Route
          path="/operator/*"
          element={
            <ProtectedRoute
              element={<OperatorApp />}
              allowedRoles={["BusOperator"]}
            />
          }
        />
        {/* User Dashboard (only for users) */}
        <Route
          path="/user/*"
          element={<ProtectedRoute element={<UserApp />} allowedRoles={["User"]} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
