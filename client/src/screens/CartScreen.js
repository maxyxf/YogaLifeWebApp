import { useAuthToken } from "../AuthTokenContext";
import { useCurrency } from "../CurrencyContext";
import useConversion from "../hooks/useConversion";
import { Link } from "react-router-dom";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import useCart from "../hooks/useCart";

export default function CartScreen() {
  const { currency } = useCurrency();
  const [conversionRate] = useConversion();
  const { cartItems, handleSelectChange, removeProductFromCart } = useCart();

  return (
    <div className="bg-white">
      <div className="mx-auto w-full px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 xl:gap-x-16">
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
                      <CheckIcon
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        aria-hidden="true"
                      />
                      <span>In stock</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </form>
        <div className="mt-8 w-full mx-auto text-center">
          <Link to="/checkout">
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              disabled={cartItems.length === 0}
              style={{ width: "50%" }}
            >
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
