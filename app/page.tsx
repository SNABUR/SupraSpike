"use client";

import { useState, useEffect, useCallback } from "react";
import { BCS,TxnBuilderTypes } from "aptos";
import Image from "next/image";
import Link from "next/link";
import PopUp from "./home/components/PopUp";
import Meme_search from "./home/Memesearch"; 

export default function Memefactory() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [memeName, setMemeName] = useState("");
  const [memeSymbol, setMemeSymbol] = useState("");
  const [URI, setURI] = useState("");
  const [projectURL, setProjectURL] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [setpopUp, setPopUp] = useState(false);

  const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";

  // ** Mejorando la inicialización del proveedor **
  const getProvider = useCallback(async () => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window as any)?.starkey.supra;
      setProvider(starkeyProvider);

      if (starkeyProvider) {
        const currentNetwork = await starkeyProvider.getChainId();
        if (currentNetwork.chainId !== 6) {
          await starkeyProvider.changeNetwork({ chainId: 6 });
          console.log("Network changed to chainId 6");
        }
      }

      return starkeyProvider || null;
    }
    return null;
  }, []);


  useEffect(() => {
    getProvider();
  }, [getProvider]);

  const handlePopUp = () => {
    setPopUp(true);
  }
  

  // ** Crear el memecoin **
  const createMeme = async () => {
    try {
      if (!provider) {
        setError("StarKey Wallet is not installed or unsupported.");
        return;
      }
      if (!memeName || !memeSymbol) {
        setError("Please fill all fields.");
        return;
      }

      setIsLoading(true);
      setError(null);

      const accounts = await provider.connect();
      const transactionData = await provider.createRawTransactionData([
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "deploy",
        [],
        [
          
          BCS.bcsSerializeStr("this is a meme"), //meme description
          BCS.bcsSerializeStr(memeName), //meme name
          BCS.bcsSerializeStr(memeSymbol), //meme SYMBOL
          BCS.bcsSerializeStr(URI), //URI JSON
          BCS.bcsSerializeStr("www.supraaspike.fun"), //WEBSITE
          BCS.bcsSerializeStr("t.me/xd"), //TELEGRAM
          BCS.bcsSerializeStr("twitter.com/spike"), //TWITTER
          
          
        ],
        { txExpiryTime: Math.ceil(Date.now() / 1000) + 30 },
      ]);

      const networkData = await provider.getChainId();
      console.log(networkData, "chain id");

      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: 6,
      };

      const tx = await provider.sendTransaction(params);
      setResult(tx);
      console.log("Transaction successful:", tx);
    } catch (err) {
      console.error("Error creating memecoin:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-3 text-black">
      <PopUp visible={setpopUp} onClose={undefined}/>
      <div className="flex flex-col mb-1 justify-center md:flex-row items-center gap-3 md:gap-3 lg:gap-3 overflow-hidden">
        
      <div className="flex flex-col w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl">
          <h1 className="text-5xl sm:text-5xl font-semibold md:text-5xl lg:text-7xl text-white font-goldeng text-center mb-4 sm:mb-7">
            CREATE MEMES
          </h1>
          <p className="text-md sm:text-base md:text-lg font-role font-bold lg:text-xl text-gray-300 text-center mb-3 mt-3 sm:mb-5 md:mb-7">
           Spike token Factory!! 🚀✨
          </p>
          <div className="flex justify-center">
            <button
              className="bg-amber-400 text-brown-900 rounded-full hover:bg-yellow-700 px-12 sm:px-12 md:px-24 py-4 sm:py-5 text-3xl md:text-3xl sm:text-xl md:text-2xl text-black font-goldeng mt-4 sm:mt-3 md:mt-5 transition duration-200 transform hover:scale-105"
              onClick={handlePopUp}
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