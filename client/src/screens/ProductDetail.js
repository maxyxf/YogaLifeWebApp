import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { useCurrency } from "../CurrencyContext";
import useConversion from "../hooks/useConversion";
import { Link } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { accessToken } = useAuthToken();
  const { currency } = useCurrency();
  const [conversionRate, setConversionRate] = useConversion();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  async function addProductToCart(productId, quantity) {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/cart/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      }
    );
    if (data.ok) {
      const updatedCart = await data.json();
    } else {
      return null;
    }
  }

  const handleSelectChange = (event) => {
    setSelectedQuantity(event.target.value);
  };

  const handleAddtoCart = () => {
    addProductToCart(product.id, selectedQuantity);
  };

  useEffect(() => {
    async function getProduct() {
      const res = await fetch(`http://localhost:8002/api/product/${id}`);
      const data = await res.json();
      setProduct(data);
    }
    getProduct();
  }, [id]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <img
            src={product.imageSrc}
            alt={product.imageSrc}
            className="h-full w-full object-cover object-center sm:rounded-lg float-left"
          />

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-10">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {currency === "CAD"
                  ? `$${product.price}`
                  : `$${(product.price * conversionRate).toFixed(2)}`}{" "}
                {currency}
              </p>
            </div>

            <div className="mt-10">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <div className="sm:flex-col1 mt-10 flex">
              <select
                className="w-20 h-10 rounded-md border border-gray-300 py-1.5 text-center text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm mt-1 mr-4"
                defaultValue={1}
                onChange={(event) => handleSelectChange(event)}
              >
                /* <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
              </select>
              {!isAuthenticated ? (
                <button
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  onClick={loginWithRedirect}
                >
                  Login
                </button>
              ) : (
                <Link to="/cart">
                  <button
                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                    onClick={handleAddtoCart}
                  >
                    Add to Cart
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
