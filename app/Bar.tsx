'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import meme from "./utils/spike.json";
import { useRouter } from "next/router";
import { HiMenuAlt4 } from "react-icons/hi";


// components/Bar.tsx
export default function Bar() {
  const [account, setAccount] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const closeMenu = (event:any) => {
      if (!event.target.closest(".toggle-menu") && 
          !event.target.closest(".toggle-button") && 
          !event.target.closest(".mini-menu-select") 
        ) {
        setToggleMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);
  
  const handleToggleClick = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation(); // Evita que el clic se propague
    setToggleMenu(prev => !prev); // Cambia el estado de toggleMenu
  };


  const getProvider = () => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const provider = (window as any)?.starkey.supra;
      if (provider) {
        setIsInstalled(true);
        return provider;
      }
    }
    setIsInstalled(false);
    return null; 
  };

  const resetWalletData = () => {
    setAccount("");
  };

  const disconnectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
    resetWalletData();
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        const accounts = await provider.connect();
        setAccount(accounts[0]);
        console.log(`Connected: ${accounts[0]}`);
      } catch (error) {
        setErrorMessage("Connection rejected by the user.");
      }
    } else {
      // Redirige al enlace de instalación si no está instalado
      window.open("https://starkey.app/", "_blank");
      setErrorMessage("StarKey Wallet is not installed. Redirecting to installation...");
    }
  };

  const handleClick = (meme: any) => {
    const url = `/Degen/${meme.network}-${meme.contract}?meme=${encodeURIComponent(JSON.stringify(meme))}`;
    window.location.href = url;
  };

  const shortAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  
  return (
    <div className="flex w-full z-50">
      <header className="relative w-full bg-black font-bold flex md:justify-center justify-between items-center py-4">
        <div className="z-10 flex items-center w-auto max-w-screen-xl mx-auto px-4 z-40">
          <nav className="hidden md:flex list-none text-xl sm:text-lg md:text-2xl lg:text-3xl xl:text-xl sm:gap-6 md:gap-12 xl:gap-16 gap-3 items-center">
            <Link
              href="/"
              className="bg-brown-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-brown-600 transition duration-300 w-full md:w-auto justify-center text-center"
            >
                <Image
                  src="/supraspike.jpg"
                  alt="SPIKE Meme"
                  width={37}
                  height={37}
                  className="rounded-3xl shadow-lg hover:scale-105 transition-transform"
                />
            </Link>
            <Link
              href="/NFT"
              className="bg-brown-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-brown-600 transition duration-300 w-full md:w-auto justify-center text-center"
            >
              NFT
            </Link>
            <Link
              href="/airdrop"
              className="bg-brown-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-brown-600 transition duration-300 w-full md:w-auto justify-center text-center"
            >
              Airdrop
            </Link>
            {/*<button
              onClick={() => handleClick(meme)}
              className="bg-brown-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-brown-600 transition duration-300 w-full md:w-auto justify-center text-center"
            >
              MemeFactory
            </button>*/}
  
            {account ? (
              <div
                className="bg-brown-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-brown-600 transition duration-300 w-full md:w-auto justify-center text-center"
                onClick={() => setShowDisconnect(!showDisconnect)}
              >
                {shortAccount}
                {showDisconnect && (
                  <button
                    onClick={disconnectWallet}
                    className="absolute top-50 left-0 bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-yellow-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 w-full md:w-auto justify-center text-center"
              >
                Connect
              </button>
            )}
          </nav>
  
          {/* Versión móvil */}
          <div className="flex md:hidden ml-auto py-2 px-3 w-full justify-between items-center">
            <button onClick={handleToggleClick} className="text-white cursor-pointer">
              {toggleMenu ? (
                <AiOutlineClose fontSize={28} />
              ) : (
                <HiMenuAlt4 fontSize={28} />
              )}
            </button>
  
            <Link href="/" className="text-white px-3 py-2 hover:text-gray-300">Home</Link>
  
            <button
              onClick={() => handleClick(meme)}
              className="text-white px-3 py-2 hover:text-gray-300"
            >
              Degen
            </button>
          </div>
  
          {/* Menu de navegación en móvil */}
          {toggleMenu && (
            <ul className="fixed top-0 right-0 w-[60vw] max-w-xs h-screen shadow-2xl md:hidden flex flex-col justify-start items-center rounded-l-lg bg-black text-white animate-slide-in z-30 p-6 toggle-menu space-y-4">
              <li className="w-full flex justify-end mb-4">
                <AiOutlineClose
                  onClick={() => setToggleMenu(false)}
                  className="text-2xl cursor-pointer hover:text-gray-400 transition duration-200"
                />
              </li>
              <li className="w-full text-center">
                <Link href="/launchpad" className="block py-2 text-lg hover:text-gray-300 transition duration-200">
                  Home
                </Link>
              </li>
              <li className="w-full text-center">
                <Link href="/memefactory" className="block py-2 text-lg hover:text-gray-300 transition duration-200">
                  Factory
                </Link>
              </li>
              <li className="w-full text-center">
                <Link href="/NFT" className="block py-2 text-lg hover:text-gray-300 transition duration-200">
                  Hall
                </Link>
              </li>
            </ul>
          )}
        </div>
      </header>
    </div>
  );
  
  
  
  }
  