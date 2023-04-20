import { useEffect, useState } from "react";

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      console.log("Fetching products...");
      const res = await fetch("http://localhost:8002/api/products");
      console.log(res);
      const data = await res.json();
      setProducts(data);
    }
    getProducts();
  }, []);

  return [products, setProducts];
}
