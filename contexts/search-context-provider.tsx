"use client";

import { createContext, useState } from "react";

type SearchContextType = {
  search: string;
  handleChangeSearch: (value: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  // state
  const [search, setSearch] = useState("");

  // event handlers
  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <SearchContext.Provider
      value={{
        search,
        handleChangeSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
