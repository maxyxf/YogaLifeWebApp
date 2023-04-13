import React from "react";
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function CartScreen() {
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

  console.log(cartItems);
  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <img src={item.imageSrc} alt={item.name} width="100" height="100" />
          <p>{item.price}</p>
        </div>
      ))}
    </div>
  );
}
