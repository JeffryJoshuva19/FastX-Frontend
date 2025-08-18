import { useState } from "react";
import "./login.css";
import { loginAPICall } from "../../services/login.service";
import { LoginModel } from "../../models/login.model";
import { LoginErrorModel } from "../../models/loginerror.model";

const Login = () => {
  const [user, setUser] = useState(new LoginModel());
  const [errors, setErrors] = useState(new LoginErrorModel());

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
        console.log(result.data);
        sessionStorage.setItem("token", result.data.token);
        sessionStorage.setItem("email", result.data.email);
        alert("Login success");
      })
      .catch((err) => {
        console.log(err);
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
          <img src="./bus-removebg-preview.png" alt="" />
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
