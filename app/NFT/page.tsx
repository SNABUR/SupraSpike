"use client";

import { useState, useEffect, useCallback } from "react";
import { BCS, TxnBuilderTypes } from "aptos";
import Image from "next/image";
import Link from "next/link";
import useGetNFT from "../hooks/getNFT";

export default function Memefactory() {
  const [account, setAccount] = useState("");
  const {mintNFT, isLoading, error, result } = useGetNFT();
  const [provider, setProvider] = useState<any>(null);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isdisable, setIsdisable] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for the pop-up
  const [txHash, setTxHash] = useState(""); // State for the transaction hash
  const [nftImage, setNftImage] = useState("/collection.jpg"); // Image for the NFT
  const [txStatus, setTxStatus] = useState<"success" | "failed" | null>(null); // Estado de la transacción

  const CONTRACT_ADDRESS = "0xa8ff8aa5c6cf9b7511250ca1218efee986a38c50c6f794dff95389623e759a4b";
  
  // ** Mejorando la inicialización del proveedor **



  const shortAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  return (
    <div className="items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 via-pink-300 to-red-400 font-sans">


        {/* Main Content */}
        <div className="flex flex-col items-center px-4">
            <div className="relative z-10 rounded-2xl overflow-hidden w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Left Box */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 text-center text-gray-800 rounded-xl shadow-lg">
                        <h1 className="text-4xl font-extrabold mb-6 text-pink-700">Supra Spike</h1>
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center w-64 h-64 bg-pink-200 rounded-lg border-4 border-pink-700 mb-6">
                                <Image
                                    src={'/collection.jpg'}
                                    alt="Spike"
                                    className="w-full h-full object-cover rounded-md"
                                    width={350}
                                    height={350}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center mb-6">
                            <h3 className="text-2xl font-semibold mb-4 text-pink-600">Details</h3>
                            <div className="flex flex-col justify-center mb-4">
                                <p className="text-lg mb-2 text-gray-700">🕸️ Network: Supra Network</p>
                                <p className="text-lg mb-2 text-gray-700">💸 Price: 13.7 SUPRA</p>
                                <p className="text-lg mb-4 text-gray-700">💎 Supply: 1370</p>
                            </div>

                            {/* Barra de progreso */}
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                <div
                                    className="bg-gradient-to-r from-pink-600 to-pink-400 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${(2 / 13700) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-black text-right">Minted: loading.../13,700</p>
                        </div>
                    </div>

                    {/* Right Box */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-pink-700 via-pink-800 to-pink-900 text-white rounded-xl shadow-lg flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-center">Spike NFT Collection 🎉</h2>
                            <p className="text-lg mb-6 leading-relaxed text-center">
                                🚀 <span className="font-semibold">The First Memecoin on Supra</span> is launching its first NFT collection! ✨
                            </p>
                            <div className="text-center mb-6">
                                <p className="text-xl font-semibold">🔓 Mint your own Spike NFT!</p>
                                <p className="text-base mt-2">Only <strong>5 NFTs per wallet</strong>. Don't miss your chance to be part of the first Supra NFT drop!</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => mintNFT()}
                                className={`w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:bg-gradient-to-l text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-lg ${
                                    isdisable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                }`}
                            >
                                Mint NFT
                            </button>
                        </div>
                        <p className="text-sm mt-6 text-center">
                            *Exclusively on Supra Network
                        </p>
                    </div>
                </div>
            </div>
        </div>
        {showPopup && (
          <div 
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50" 
            onClick={() => setShowPopup(false)} // Close the popup when clicking outside
          >
            <div 
              className="bg-gradient-to-r from-pink-400 to-teal-400 rounded-lg p-6 sm:p-8 max-w-sm sm:max-w-md lg:max-w-lg w-full shadow-xl relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the pop-up
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 text-white">
                Transaction Successful!
              </h3>
              <p className="text-center mb-4 sm:mb-6 text-base sm:text-lg lg:text-xl text-gray-100">
                Your transaction was successfully processed.
              </p>
              
              <div className="text-center mb-6 sm:mb-8">
                <p className="text-sm sm:text-base lg:text-lg text-white mb-2">TX Hash:</p>
                <a 
                  href={`https://suprascan.io/tx/${txHash}/f?tab=tx-advance`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base sm:text-lg lg:text-xl text-indigo-500 font-semibold hover:text-indigo-600 break-all"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-10)} {/* Display only the start and end of the hash */}
                </a>
              </div>
              
              <div className="flex justify-center mb-6 sm:mb-8">
                <Image 
                  src={nftImage} 
                  alt="NFT" 
                  width={120} 
                  height={120} 
                  className="sm:w-[160] sm:h-[160] lg:w-[160px] lg:h-[160px] rounded-lg shadow-2xl transform hover:scale-105 transition duration-300"
                />
              </div>
              
              <div className="text-center mt-4 sm:mt-6">
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-red-500 text-white py-2 sm:py-3 px-8 sm:px-12 text-sm sm:text-base lg:text-lg rounded-full hover:bg-red-600 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
);



}