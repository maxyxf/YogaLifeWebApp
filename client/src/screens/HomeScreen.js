import React from "react";
import ProductList from "../components/ProductList";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 ">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src="https://www.rei.com/dam/content_team_053017_81385_yoga_gear_how_choose_lg.jpg?t=ea16by9lg"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  <span className="block sm:inline">Yoga Life</span>
                </h2>
                <p className="mt-3 text-xl text-white">
                  Welcome to Yogalife, your go-to source for premium yoga mats
                  and towels. We offer a wide range of high-quality products
                  that are designed to enhance your practice. Browse our
                  selection today and discover the difference that a great mat
                  or towel can make!
                </p>
                <Link to="/products">
                  <button className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="flex items-center justify-center text-2xl font-bold tracking-tight text-gray-900">
        Featured Products
      </h2>
      <ProductList />;
    </>
  );
}
