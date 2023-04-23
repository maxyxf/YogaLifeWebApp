import React from "react";
import ProductList from "../components/ProductList";
import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";

export default function HomeScreen() {
  const [products] = useProducts();
  const latestProduct = products.slice(-8).reverse();
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 ">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src="https://www.rei.com/dam/content_team_053017_81385_yoga_gear_how_choose_lg.jpg?t=ea16by9lg"
                alt="people doing yoga"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  <span className="block sm:inline">Yoga Life</span>
                </h2>
                <p className="mt-3 text-xl text-white">
                  Welcome to Yogalife, your ultimate destination for premium
                  yoga essentials. We are your one-stop-shop for top-quality
                  yoga mats, towels, and blocks that are crafted to elevate your
                  practice. Explore our extensive collection today and
                  experience the remarkable impact that high-quality equipment
                  can have on your yoga routine!
                </p>
                <Link to="/products">
                  <button
                    aria-label="Shop All Products"
                    className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                  >
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="flex items-center justify-center text-2xl font-bold tracking-tight text-gray-900">
        Latest Products
      </h2>
      <ProductList products={latestProduct} />;
    </>
  );
}
