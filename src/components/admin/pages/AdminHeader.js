import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();
  const adminName = sessionStorage.getItem("adminName") || "Admin";

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>FastX Admin Panel</div>
      <div style={userSectionStyle}>
        <span style={adminNameStyle}>Welcome, {adminName}</span>
        <button style={logoutButtonStyle} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </header>
  );
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#1976d2",
  color: "white",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
};

const logoStyle = {
  fontWeight: "bold",
  fontSize: "18px",
};

const userSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const adminNameStyle = {
  fontWeight: "500",
};

const logoutButtonStyle = {
  backgroundColor: "#f44336",
  border: "none",
  color: "white",
  padding: "5px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AdminHeader;
