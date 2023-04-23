import { useEffect, useState } from "react";

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    }
    getProducts();
  }, []);

  return [products, setProducts];
}
