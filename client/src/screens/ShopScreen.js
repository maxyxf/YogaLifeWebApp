import React from "react";
import ProductList from "../components/ProductList";
import { useState } from "react";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function ShopScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="xl:pl-45">
        {/* Sticky search header */}
        <div className=" flex h-16 shrink-0 items-center gap-x-6 px-4 sm:px-6 lg:px-60 mt-7">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative mx-auto w-full md:w-3/5 lg:w-3/5 ">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 ml-1 text-gray-500"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full bg-gray-100 py-0 pl-8 pr-0 text-black focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <ProductList />;
    </>
  );
}
