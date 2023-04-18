import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AddProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            price: parseFloat(price),
            imageSrc,
            description,
          }),
        }
      );
      const product = await response.json();
      console.log(product);
      setName("");
      setPrice("");
      setImageSrc("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8 space-y-12 ">
        <div className="border-b border-gray-900/10 ">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Add Product
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="number"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image Source
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    value={imageSrc}
                    onChange={(event) => setImageSrc(event.target.value)}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="Image Source"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  type="text"
                  value={description}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8 mr-32 flex items-center justify-end gap-x-6">
        <Link to="/productList">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
        </Link>
        <Link to="/">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleSave}
          >
            Save
          </button>
        </Link>
      </div>
    </form>
  );
}
