import React, { useContext, useState } from "react";

const CurrencyContext = React.createContext();

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("CAD");
  const value = { currency, setCurrency };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

const useCurrency = () => useContext(CurrencyContext);

export { useCurrency, CurrencyProvider };
