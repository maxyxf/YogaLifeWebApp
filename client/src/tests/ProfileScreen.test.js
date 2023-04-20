import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileScreen from "../screens/ProfileScreen";

let mockIsAuthenticated = false;

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: {
        sub: "subId",
        name: "max",
        email: "max@outlook.com",
        email_verified: true,
      },
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: jest.fn(),
    };
  },
}));

test("renders Profile", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <ProfileScreen />
    </MemoryRouter>
  );

  expect(screen.getByText("max")).toBeInTheDocument();
  expect(screen.getByText("max@outlook.com")).toBeInTheDocument();
  expect(screen.getByText("subId")).toBeInTheDocument();
  expect(screen.getByText("true")).toBeInTheDocument();
});
