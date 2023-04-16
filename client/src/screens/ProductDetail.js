import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import useCartItems from "../hooks/useCartItems";
import { useCurrency } from "../CurrencyContext";
import useConversion from "../hooks/useConversion";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { accessToken } = useAuthToken();
  const { cartItems, setCartItems } = useCartItems();
  const { currency } = useCurrency();
  const [conversionRate, setConversionRate] = useConversion();

  async function addProductToCart(productId) {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/cart/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (data.ok) {
      const updatedCart = await data.json();
      setCartItems(updatedCart.products);
    } else {
      return null;
    }
  }

  console.log(cartItems);

  useEffect(() => {
    async function getProduct() {
      const res = await fetch(`http://localhost:8002/api/product/${id}`);
      const data = await res.json();
      setProduct(data);
    }
    getProduct();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-100">
          <div className="text-gray-600">{product.name}</div>
        </div>

        <div className="flex flex-wrap justify-between px-6 py-4">
          <div className="w-full md:w-6/12 lg:w-5/12">
            <img
              src={product.imageSrc}
              alt={product.name}
              className="w-full object-contain"
            />
          </div>

          <div className="flex justify-center items-center w-full md:w-6/12 lg:w-7/12 px-4 py-8 md:py-0">
            <div className="flex flex-col justify-center items-center h-full w-full">
              <div className="flex items-center">
                <span className="text-gray-600">
                  {currency === "CAD"
                    ? `$${product.price}`
                    : `$${(product.price * conversionRate).toFixed(2)}`}{" "}
                  {currency}
                </span>
              </div>

              {!isAuthenticated ? (
                <button
                  className={
                    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-30"
                  }
                  onClick={loginWithRedirect}
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  className={
                    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-30"
                  }
                  // onClick={() => handleClick(product.id)}
                  onClick={() => addProductToCart(product.id)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
