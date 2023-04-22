import React, { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useCurrency } from "../CurrencyContext";
import useConversion from "../hooks/useConversion";
import { Link } from "react-router-dom";
import {
  CheckIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const { accessToken } = useAuthToken();
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { currency } = useCurrency();
  const [conversionRate, setConversionRate] = useConversion();

  useEffect(() => {
    async function getCartItemsFromApi() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const cart = await data.json();
      //console.log(cart);
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

  const handleSelectChange = (event, productId) => {
    const newQuantity = event.target.value;
    handleQuantityChange(productId, newQuantity);
  };

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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cartItems.map((product, productIdx) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.imageSrc}
                        alt={product.name}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </Link>
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link to={`/product/${product.id}`}>
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{product.color}</p>
                          {product.size ? (
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                              {product.size}
                            </p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {currency === "CAD"
                            ? `$${product.price}`
                            : `$${(product.price * conversionRate).toFixed(
                                2
                              )}`}{" "}
                          {currency}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${productIdx}`}
                          className="sr-only"
                        >
                          Quantity, {product.name}
                        </label>
                        <select
                          id={`quantity-${productIdx}`}
                          name={`quantity-${productIdx}`}
                          className="w-20 rounded-md border border-gray-300 py-1.5 text-center text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          defaultValue={product.quantity}
                          onChange={(event) =>
                            handleSelectChange(event, product.id)
                          }
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

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              removeProductFromCart(product.id);
                            }}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      {/* {product.inStock ? ( */}
                      <CheckIcon
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        aria-hidden="true"
                      />
                      {/* ) : (
                        <ClockIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                      )} */}

                      <span>
                        In stock
                        {/* {product.inStock ? "In stock" : `Ships in 1 week`} */}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {currency === "CAD"
                    ? `$${price}`
                    : `$${(price * conversionRate).toFixed(2)}`}{" "}
                  {currency}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {currency === "CAD"
                    ? `$${shipping}`
                    : `$${(shipping * conversionRate).toFixed(2)}`}{" "}
                  {currency}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {" "}
                  {currency === "CAD"
                    ? `$${tax}`
                    : `$${(tax * conversionRate).toFixed(2)}`}{" "}
                  {currency}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {currency === "CAD"
                    ? `$${totalPrice}`
                    : `$${(totalPrice * conversionRate).toFixed(2)}`}{" "}
                  {currency}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
