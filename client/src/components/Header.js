import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCurrency } from "../CurrencyContext";
import { AiOutlineUser } from "react-icons/ai";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Shop", href: "/products", current: false },
  { name: "Auth Debugger", href: "/debugger", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { currency, setCurrency } = useCurrency();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleClick = () => {
    if (currency === "CAD") {
      setCurrency("USD");
    } else {
      setCurrency("CAD");
    }
  };

  const { logout } = useAuth0();

  return (
    <Disclosure as="nav" className="bg-lightBrown">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className=" margin-bottom: 1px flex flex-shrink-0 items-center">
                  <p className="mt-0.5 text-xl font-bold font-weight: 800">
                    YogaLife
                  </p>
                </div>
                <div className="mt-1 hidden sm:ml-6 sm:block">
                  <div className="mt-0.5 flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="lg:ml-2 lg:mr-2 lg: mt-0.5">
                  <button
                    onClick={handleClick}
                    className="border border-black p-2 lg:w-12 lg:h-7 sm: w-10 sm: h-6 flex justify-center items-center sm:text-sm "
                    style={{ borderWidth: "1.8px", fontSize: "1rem" }}
                  >
                    {currency}
                  </button>
                </div>
                <div className="lg:ml-6 lg:mr-7 sm: ml-3 sm: mr-2 mt-1.5">
                  <Link to="/cart">
                    <button type="button" aria-label="Shopping Cart">
                      <HiOutlineShoppingBag
                        className="h-7 w-7"
                        aria-hidden="true"
                      />
                    </button>
                  </Link>
                </div>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ">
                  <div>
                    <Menu.Button className="flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <AiOutlineUser className="h-7 w-7 rounded-full text-gray-800" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/ProductList"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Product List
                          </Link>
                        )}
                      </Menu.Item>
                      {isAuthenticated ? (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                logout({ returnTo: window.location.origin })
                              }
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={loginWithRedirect}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Login
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
