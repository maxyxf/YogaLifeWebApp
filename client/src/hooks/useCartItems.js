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
      const cartItemsWithQuantity = cart.products.map((product) => {
        const cartProduct = cart.cartProduct.find(
          (item) => item.productId === product.id
        );
        return { ...product, quantity: cartProduct.quantity };
      });

      setCartItems(cartItemsWithQuantity);
    }

    if (accessToken) {
      getCartItemsFromApi();
    }
  }, [accessToken]);

  console.log(cartItems);
  return [cartItems, setCartItems];
}
