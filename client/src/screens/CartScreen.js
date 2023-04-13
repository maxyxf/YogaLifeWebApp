import React from "react";
import { useAuthToken } from "../AuthTokenContext";
import useCartItems from "../hooks/useCartItems";

export default function CartScreen() {
  const [cartItems, setCartItems] = useCartItems();
  const { accessToken } = useAuthToken();

  async function removeProductFromCart(productId) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/cart/product`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });
    if (data.ok) {
      const updatedCart = await data.json();
      setCartItems(updatedCart.products);
    } else {
      return null;
    }
  }

  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <img src={item.imageSrc} alt={item.name} width="100" height="100" />
          <p>{item.price}</p>
          <button onClick={() => removeProductFromCart(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
