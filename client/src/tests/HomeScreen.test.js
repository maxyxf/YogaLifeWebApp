import { render, screen } from "@testing-library/react";
import ShopScreen from "../screens/ShopScreen";
import { MemoryRouter } from "react-router-dom";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

jest.mock("../CurrencyContext", () => ({
  useCurrency: () => {
    return { currency: "CAD" };
  },
}));

fetch.mockResponse(
  JSON.stringify([
    { id: 1, name: "product1", price: 55 },
    { id: 2, name: "product2", price: 55 },
    { id: 3, name: "product3", price: 55 },
  ])
);

test("renders products list", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <ShopScreen />
    </MemoryRouter>
  );

  const product1 = await screen.findByText("product1");
  const product2 = await screen.findByText("product2");

  expect(product1).toBeInTheDocument();
  expect(product2).toBeInTheDocument();
});
