"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; 

const Searcher = ({ setMemeData, setTableName, setChainNet }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = useRef(null); 
  const router = useRouter(); 

  const handleClickOutside = (event) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!search) return; 
  
    const controller = new AbortController(); 
    const signal = controller.signal;
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/db_memes?search=${encodeURIComponent(search)}`,
        { signal }
      );
      console.log(response, "response data handle search");
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      if (error.name !== "AbortError") { 
        console.error("Error fetching memes:", error);
      }
    }
  };
  

  const handleSelectResult = (result) => {
    setMemeData(result);
    setTableName(result.tokenAddress.substring(1));
    setChainNet(result.network);

    // Usa router.push para navegar entre rutas
    router.push(`/Degen/${result.name}-${result.symbol}`);
    setSearchResults([]);
    setSearch("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex sm:flex-row justify-center font-role font-bold items-center h-full gap-3 sm:space-y-0 z-30 relative w-full px-1">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress}
        type="text"
        className="w-full text-sm text-white sm:max-w-lg rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="🔍 Search by token contract address"
      />
      <button
        onClick={handleSearch}
        className="w-min sm:w-auto bg-amber-400 text-brown-900 rounded-md px-4 py-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Search
      </button>
      {searchResults.length > 0 && (
        <div
          ref={searchResultsRef}
          className="absolute top-full text-white mt-2 w-full max-w-lg bg-gray-800 rounded-md shadow-lg z-10"
        >
          {searchResults.map((result) => (
            <div
              key={`${result.id}-${result.tokenAddress}`}
              onClick={() => handleSelectResult(result)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-700"
            >
              {result.name}{" "}
              <span className="italic">{`(${result.tokenAddress.slice(0, 6)}...${result.tokenAddress.slice(-4)})`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searcher;
