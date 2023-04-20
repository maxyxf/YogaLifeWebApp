import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useConversion from "../hooks/useConversion";
import { useCurrency } from "../CurrencyContext";

export default function ProductList({ products }) {
  const { currency } = useCurrency();
  const [conversionRate, setConversionRate] = useConversion();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-15 lg:max-w-7xl lg:px-8">
        <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-50">
                <img
                  src={product.imageSrc}
                  alt={product.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/product/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  $
                  {currency === "CAD"
                    ? product.price
                    : (product.price * conversionRate).toFixed(2)}{" "}
                  {currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
