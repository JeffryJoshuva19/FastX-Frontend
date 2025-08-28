import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.model.css";
import { loginAPICall } from "../../services/login.service";
import { LoginModel } from "../../models/login.model";
import { LoginErrorModel } from "../../models/loginerror.model";
import {jwtDecode} from "jwt-decode";


const Login = () => {
  const [user, setUser] = useState(new LoginModel());
  const [errors, setErrors] = useState(new LoginErrorModel());
  const navigate = useNavigate();

  const changeUser = (eventArgs) => {
    const fieldName = eventArgs.target.name;
    switch (fieldName) {
      case "email":
        if (eventArgs.target.value === "")
          setErrors((e) => ({ ...e, email: "Email cannot be empty" }));
        else {
          setUser((u) => ({ ...u, email: eventArgs.target.value }));
          setErrors((e) => ({ ...e, email: "" }));
        }
        break;
      case "password":
        if (eventArgs.target.value === "")
          setErrors((e) => ({ ...e, password: "Password cannot be empty" }));
        else {
          setUser((u) => ({ ...u, password: eventArgs.target.value }));
          setErrors((e) => ({ ...e, password: "" }));
        }
        break;
      default:
        break;
    }
  };

  const login = () => {
    if (errors.email.length > 0 || errors.password.length > 0) return;

    loginAPICall(user)
      .then((result) => {
        console.log("Login success:", result.data);

        const token = result.data.token;
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // decoded.role = "1"
let role = decoded.role;

// Map numeric role → string
if (role === "1") role = "Admin";
else if (role === "2") role = "BusOperator";
else role = "User";

// ✅ Save token & user info to sessionStorage
sessionStorage.setItem("token", result.data.token);
sessionStorage.setItem("email", result.data.email);
sessionStorage.setItem("role", role); // save mapped role
sessionStorage.setItem("userId", decoded.nameid);
console.log("Saved role:", role);
sessionStorage.setItem("adminName", result.data.name); // or result.data.fullName depending on API
console.log(result.data);

alert("Login success 🎉");

// ✅ Navigate based on role
if (role === "Admin") {
  navigate("/admin/dashboard");
} else if (role === "BusOperator") {
  navigate("/operator/dashboard");
} else {
  navigate("/user/dashboard");
}

      })
      .catch((err) => {
        console.error("Login failed:", err);
        if (err.response?.status === 401)
          alert(err.response.data.errorMessage);
        else alert("Login failed. Please try again.");
      });
  };

  const cancel = () => {
    setUser(new LoginModel());
    setErrors(new LoginErrorModel());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Bus Illustration */}
        <div className="bus-illustration">
          <img src="/bus-removebg-preview.png" alt="bus" />
        </div>

        <h1 className="login-title">Bus Ticket Booking</h1>
        <p className="login-subtitle">Login to continue your journey 🚍</p>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={changeUser}
            className="loginInput"
            placeholder="Enter your email"
          />
          {errors.email?.length > 0 && (
            <span className="error-text">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={changeUser}
            className="loginInput"
            placeholder="Enter your password"
          />
          {errors.password?.length > 0 && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="loginButton" onClick={login}>
            Login
          </button>
          <button className="cancelButton" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
