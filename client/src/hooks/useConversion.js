import { useState, useEffect } from "react";

export default function useConversion() {
  const [conversionRate, setConversionRate] = useState(1); // default currency is CAD

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/bfb9820b5f4ef3d5d5cad1c7/latest/CAD`
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
