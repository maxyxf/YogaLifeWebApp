import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useCartItems() {
  const [cartItems, setCartItems] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getCartItemsFromApi() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const cart = await data.json();

      setCartItems(cart.products);
    }

    if (accessToken) {
      getCartItemsFromApi();
    }
  }, [accessToken]);

  return [cartItems, setCartItems];
}
