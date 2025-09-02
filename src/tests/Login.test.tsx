// src/tests/Login.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/login/login"; // Adjust path if needed
import { loginAPICall } from "../services/login.service";

// ✅ Mock react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// ✅ Mock login service
jest.mock("../services/login.service");

describe("Login Component", () => {
  // ✅ Cast loginAPICall as jest mock to fix TS error
  const mockedLoginAPICall = loginAPICall as jest.MockedFunction<typeof loginAPICall>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear sessionStorage before each test
    sessionStorage.clear();
    // Mock window.alert
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders login form correctly", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("shows validation errors when inputs are empty", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });

    expect(screen.getByText("Email cannot be empty")).toBeInTheDocument();
    expect(screen.getByText("Password cannot be empty")).toBeInTheDocument();
  });

  test("calls loginAPICall and navigates on successful login", async () => {
    // ✅ Mock API response
    mockedLoginAPICall.mockResolvedValueOnce({
      data: {
        token: "mockToken",
        email: "test@example.com",
        name: "Test User",
      },
    } as any);

    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      // ✅ Check API call
      expect(mockedLoginAPICall).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });

      // ✅ Check sessionStorage
      expect(sessionStorage.getItem("token")).toBe("mockToken");
      expect(sessionStorage.getItem("email")).toBe("test@example.com");

      // ✅ Check navigation
      expect(mockedNavigate).toHaveBeenCalled();
    });
  });

  test("resets form on cancel", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const cancelButton = screen.getByText("Cancel");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(cancelButton);

    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });
});
