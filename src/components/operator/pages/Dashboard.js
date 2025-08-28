import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  FaUser,
  FaBus,
  FaUserTie,
  FaFileAlt,
  FaMoneyBillWave
} from "react-icons/fa";
import { apiFetch } from "../../../utils/api";
import "./Dashboard.css";
import AdminHeader from "./AdminHeader";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingGraphs, setLoadingGraphs] = useState(true);

  useEffect(() => {
    // ✅ Stats API
    apiFetch("/BusOperator/dashboard-summary")
      .then((data) => {
        setStats([
          { title: "Buses", value: data.totalBuses || 0, icon: <FaBus /> },
          { title: "Bookings", value: data.totalBookings || 0, icon: <FaFileAlt /> },
          { title: "Total Passengers", value: data.totalPassengers || 0, icon: <FaUserTie /> },
          { title: "Total Revenue", value: data.totalRevenue || 0, icon: <FaMoneyBillWave /> }
        ]);
      })
      .catch((err) => console.error("❌ Error fetching stats:", err))
      .finally(() => setLoadingStats(false));

    // ✅ Graphs API
    apiFetch("/BusOperator/dashboard-graphs")
      .then((data) => setDashboardData(data))
      .catch((err) => console.error("❌ Error fetching graphs:", err))
      .finally(() => setLoadingGraphs(false));
  }, []);

  const COLORS = ["#4fc3f7", "#81c784", "#ffb74d", "#e57373", "#9575cd"];

  return (
    <div>
      <AdminHeader />

      <div className="admin-page" style={{ paddingTop: "20px" }}>
        <h1>Dashboard</h1>

        {/* ✅ Summary Cards */}
        {loadingStats ? (
          <p>Loading stats...</p>
        ) : (
          <div className="admin-stats">
            {stats.map((s, i) => (
              <div className="admin-card" key={i}>
                <div className="card-icon">{s.icon}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Graphs */}
        {loadingGraphs ? (
          <p style={{ marginTop: "40px" }}>Loading graphs...</p>
        ) : (
          dashboardData && (
            <div style={{ marginTop: "40px" }}>
              {/* 📈 Monthly Revenue */}
              <h2>Monthly Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4fc3f7"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* 📉 Monthly Bookings */}
              <h2 style={{ marginTop: "40px" }}>Monthly Bookings Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.monthlyBookings}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#81c784"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* 🚌 Bus Utilization */}
              <h2 style={{ marginTop: "40px" }}>Bus Utilization (%)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.busUtilization}>
                  <XAxis dataKey="bus" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#ffb74d" />
                </BarChart>
              </ResponsiveContainer>

              {/* 🛣️ Route Popularity */}
              <h2 style={{ marginTop: "40px" }}>Route Popularity</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.routePopularity}
                    dataKey="count"
                    nameKey="route"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {dashboardData.routePopularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;
