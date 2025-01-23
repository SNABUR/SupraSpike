"use client";

import { useState, useEffect, useCallback } from "react";
import { BCS,TxnBuilderTypes } from "aptos";
import Image from "next/image";
import Link from "next/link";
import PopUp from "./home/components/PopUp";
import Meme_search from "./home/Memesearch"; 

export default function Memefactory() {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showMyModal, setShowMyModal] = useState(false);

  const handleOnClose = () => setShowMyModal(false);


  return (
    <div className="p-3 text-black">
      <PopUp visible={showMyModal} onClose={handleOnClose}/>
      <div className="flex flex-col mb-1 justify-center md:flex-row items-center gap-3 md:gap-3 lg:gap-3 overflow-hidden">
        
      <div className="flex flex-col w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl">
          <h1 className="text-5xl sm:text-5xl font-semibold md:text-5xl lg:text-7xl text-white font-goldeng text-center mb-4 sm:mb-7">
            CREATE COINS
          </h1>
          <p className="text-md sm:text-base md:text-lg font-role font-bold lg:text-xl text-gray-300 text-center mb-3 mt-3 sm:mb-5 md:mb-7">
             Meme Factory + DAO Builder. Where creativity meets blockchain!🚀✨</p>
          <div className="flex justify-center">
            <button
              className="bg-amber-400 text-brown-900 rounded-full hover:bg-yellow-700 px-12 sm:px-12 md:px-24 py-4 sm:py-5 text-3xl md:text-3xl sm:text-xl md:text-2xl text-black font-goldeng mt-4 sm:mt-3 md:mt-5 transition duration-200 transform hover:scale-105"
              onClick={() => setShowMyModal(true)}
              >
              Create
            </button>
          </div>
        </div>
        <div className="flex w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg overflow-hidden rounded-lg">
          <img 
            alt="spike"
            src="/spike.png"
            width={500}
            height={500}
            className="w-full h-auto object-cover" 
            style={{ transform: "rotate(-7deg)" }} 
          />
        </div>
  

  

    </div>
          {/* Result Section */}
          {result && (
        <div className="w-full max-w-4xl mt-10 bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow-md flex items-center gap-4">
          <span className="text-2xl">✅</span>
          <p>
            <strong>Transaction Successful:</strong>{" "}
            <a
              href={`https://testnet.suprascan.io/tx/${result}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              View on Explorer
            </a>
          </p>
        </div>
      )}
  
      {/* Error Section */}
      {error && (
        <div className="w-full max-w-4xl mt-10 bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg shadow-md flex items-center gap-4">
          <span className="text-2xl">❌</span>
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
      <div>
      </div>
      <Meme_search/>
  </div>
  
      );
}