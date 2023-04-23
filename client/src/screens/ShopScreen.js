import { Fragment, useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import useProducts from "../hooks/useProducts";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";

const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "Yoga Mat", label: "Yoga Mat" },
      { value: "Yoga Towel", label: "Yoga Towel" },
      { value: "Yoga Block", label: "Yoga Block" },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "pink", label: "Pink" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "white", label: "White" },
      { value: "black", label: "Black" },
      { value: "purple", label: "Purple" },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ShopScreen() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products] = useProducts();
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);

  const handleColorChange = (e) => {
    const color = e.target.value;
    if (e.target.checked) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    }
  };

  useEffect(() => {
    setSearchProducts(products);
  }, [products]);

  useEffect(() => {
    setSearchProducts(
      products.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, products]);

  useEffect(() => {
    if (selectedColors.length > 0) {
      setSearchProducts(
        products.filter((p) => {
          return selectedColors.some((c) =>
            p.name.toLowerCase().includes(c.toLowerCase())
          );
        })
      );
    } else {
      setSearchProducts(products);
    }
  }, [selectedColors, products]);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4">
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.name}
                        className="border-t border-gray-200 pb-4 pt-4"
                      >
                        {({ open }) => (
                          <fieldset>
                            <legend className="w-full px-2">
                              <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                <span className="text-sm font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </Disclosure.Button>
                            </legend>
                            <Disclosure.Panel className="px-4 pb-2 pt-4">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`${section.id}-${optionIdx}-mobile`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onClick={handleColorChange}
                                    />
                                    <label
                                      htmlFor={`${section.id}-${optionIdx}-mobile`}
                                      className="ml-3 text-sm text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </fieldset>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
          <div className="border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              All Products
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Checkout out the latest release of Yoga mats!
            </p>
          </div>

          <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>

              <button
                type="button"
                className="inline-flex items-center lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
                <PlusIcon
                  className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </button>

              <div className="hidden lg:block">
                <form className="space-y-10 divide-y divide-gray-200">
                  {filters.map((section, sectionIdx) => (
                    <div
                      key={section.name}
                      className={sectionIdx === 0 ? null : "pt-10"}
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {section.name}
                        </legend>
                        <div className="space-y-3 pt-6">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                defaultValue={option.value}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onClick={handleColorChange}
                              />
                              <label
                                htmlFor={`${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ))}
                </form>
              </div>
            </aside>

            {/* Product grid */}
            <div className="lg:col-span-2 xl:col-span-3 mt-2">
              <div className="xl:pl-45">
                {/* Sticky search header */}
                <div className=" flex h-16 shrink-0 items-center gap-x-6 px-4 sm:px-6 lg:px-60 ">
                  <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form className="flex flex-1" action="#" method="GET">
                      <label htmlFor="search-field" className="sr-only">
                        Search
                      </label>
                      <div className="relative mx-auto w-full">
                        <MagnifyingGlassIcon
                          className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 ml-1 items-center text-gray-500"
                          aria-hidden="true"
                        />
                        <input
                          id="search-field"
                          className="block h-full w-full bg-gray-100 py-0 pl-8 pr-0 text-black focus:ring-0 sm:text-sm"
                          placeholder="Search..."
                          type="search"
                          name="search"
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <ProductList products={searchProducts} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
