// src/tests/users/Home.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../../components/user/pages/Home";
import axios from "axios";
// ✅ Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// ✅ Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Home Component", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { from: "Chennai", to: "Bangalore", description: "Test route", imageUrl: "test.jpg" }
      ],
    });
  });

  test("renders Home component and popular routes", async () => {
    render(<Home />);

    // Check for hero text
    expect(screen.getByText(/Book Your Bus Tickets Effortlessly/i)).toBeInTheDocument();

    // Wait for the mocked popular routes to appear
    await waitFor(() => {
      expect(screen.getByText(/Chennai → Bangalore/i)).toBeInTheDocument();
      expect(screen.getByText(/Test route/i)).toBeInTheDocument();
    });
  });
});
