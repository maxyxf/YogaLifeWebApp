import React from "react";
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import useCartItems from "../hooks/useCartItems";

export default function CartScreen() {
  const [cartItems] = useCartItems();

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
