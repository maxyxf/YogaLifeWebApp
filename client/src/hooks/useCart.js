import { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";

function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
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
        const cartItemProduct = cart.cartProduct.find(
          (item) => item.productId === product.id
        );
        const quantity = cartItemProduct ? cartItemProduct.quantity : 0;
        return { ...product, quantity };
      });

      if (JSON.stringify(cartItemsWithQuantity) !== JSON.stringify(cartItems)) {
        setCartItems(cartItemsWithQuantity);
      }
    }

    if (accessToken) {
      getCartItemsFromApi();
    }
  }, [accessToken, cartItems]);

  useEffect(() => {
    const newPrice = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    const newTax = (newPrice * 0.12).toFixed(2);
    const newShippingCost = cartItems.length > 0 ? 8 : 0;
    const newTotalPrice = (
      newPrice +
      parseFloat(newTax) +
      newShippingCost
    ).toFixed(2);
    setPrice(newPrice);
    setTax(newTax);
    setShipping(newShippingCost);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  async function handleQuantityChange(productId, quantity) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/cart/item/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      }
    );
    const cart = await response.json();
    const cartItemsWithQuantity = cart.products.map((product) => {
      const cartProduct = cart.cartProduct.find(
        (item) => item.productId === product.id
      );
      return { ...product, quantity: cartProduct.quantity };
    });

    setCartItems(cartItemsWithQuantity);
  }

  async function removeProductFromCart(productId) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/cart/product/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const cart = await response.json();
      const cartItemsWithQuantity = cart.products.map((product) => {
        const cartProduct = cart.cartProduct.find(
          (item) => item.productId === product.id
        );
        return { ...product, quantity: cartProduct.quantity };
      });

      setCartItems(cartItemsWithQuantity);
    } else {
      return null;
    }
  }

  const handleSelectChange = (event, productId) => {
    const newQuantity = event.target.value;
    handleQuantityChange(productId, newQuantity);
  };

  async function removeAllProductsFromCart() {
    await fetch(`${process.env.REACT_APP_API_URL}/cart/products`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return {
    cartItems,
    setCartItems,
    price,
    tax,
    shipping,
    totalPrice,
    handleQuantityChange,
    removeProductFromCart,
    handleSelectChange,
    removeAllProductsFromCart,
  };
}

export default useCart;
