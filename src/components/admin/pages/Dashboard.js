import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { FaUser, FaBus, FaUserTie, FaFileAlt } from "react-icons/fa";
import { apiFetch } from "../../../utils/api";
import "./Dashboard.css";
import AdminHeader from "./AdminHeader";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [bookingTrend, setBookingTrend] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topRoutesData, setTopRoutesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Dashboard stats
        const statsRes = await apiFetch("/Admin/dashboard-stats");
        setStats([
          { title: "Total Users", value: statsRes.totalUsers || 0, icon: <FaUser /> },
          { title: "Bus Operators", value: statsRes.totalOperators || 0, icon: <FaUserTie /> },
          { title: "Buses", value: statsRes.totalBuses || 0, icon: <FaBus /> },
          { title: "Bookings", value: statsRes.totalBookings || 0, icon: <FaFileAlt /> },
        ]);

        // 2. Booking trend per month
        const trendRes = await apiFetch("/Admin/booking-trend");
        setBookingTrend(trendRes || []);

        // 3. Bookings by payment method
        const paymentRes = await apiFetch("/Admin/bookings-by-payment");
        const formattedPayments = (paymentRes || []).map((d) => ({
          name: d.paymentMethod?.methodName || "Unknown",
          value: d.count || 0,
        }));
        setPaymentData(formattedPayments);

        // 4. Revenue per month
        const revenueRes = await apiFetch("/Admin/monthly-revenue");
        setRevenueData(revenueRes || []);

        // 5. Top routes
        const routesRes = await apiFetch("/Admin/top-routes");
        setTopRoutesData(routesRes || []);
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <AdminHeader />
      <div className="admin-page" style={{ paddingTop: "20px" }}>
        <h1>Dashboard</h1>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            {/* Summary Cards */}
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
<div className="charts-grid">
            {/* Booking Trend Line Chart */}
            <div className="chart-container">
              <h2>Booking Trend (per month)</h2>
              {bookingTrend.length === 0 ? (
                <p>No booking data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingTrend}>
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#4fc3f7" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart - Bookings by Payment Method */}
            <div className="chart-container">
              <h2>Bookings by Payment Method</h2>
              {paymentData.length === 0 ? (
                <p>No payment data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            </div>

            {/* Bar Chart - Revenue per Month */}
            <div className="chart-container">
              <h2>Revenue per Month</h2>
              {revenueData.length === 0 ? (
                <p>No revenue data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#82ca9d" barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Horizontal Bar Chart - Top Routes */}
            <div className="chart-container">
              <h2>Top Routes by Bookings</h2>
              {topRoutesData.length === 0 ? (
                <p>No route data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    layout="vertical"
                    data={topRoutesData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="route" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
