import { useState, useEffect } from "react";

export default function useConversion() {
  const [conversionRate, setConversionRate] = useState(1);
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/716cb25a0fe1687ef9918db1/latest/CAD`
        );
        const data = await response.json();
        const rate = data.conversion_rates.USD;
        setConversionRate(rate);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversionRate();
  }, []);

  return [conversionRate, setConversionRate];
}
