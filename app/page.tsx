"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ApproveTransaction from "./components/approve";
import Airdrop from "./components/Airdrop";
import Link from "next/link";

export default function Home() {
  const [account, setAccount] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      provider
        .account()
        .then((accounts: string | any[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            console.log(`Already connected: ${accounts[0]}`);
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }, []);

  const shortAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-pink-500 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="relative flex flex-wrap items-center justify-between px-4 py-3 bg-purple-800 shadow-md">
      {/* Logo y Título */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Image
          src="/spike.jpg"
          alt="Spike Logo"
          width={40}
          height={40}
          className="rounded-full shadow-lg"
        />
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white">Spike</h1>
      </div>
      {/* Opciones del Menú Desplegable */}
      <div
      className={`absolute top-full right-0 w-1/3 bg-purple-900 bg-opacity-95 px-3 rounded-xl flex flex-col items-center py-4 shadow-lg z-50 transition-all duration-300 md:hidden ${
        showMenu ? "opacity-100 scale-100 pointer-events-auto visible" : "opacity-0 scale-95 pointer-events-none invisible"
      }`}
    >
              <div className="flex mb-3 items-center gap-4 mt-4">
          <a href="https://x.com/supra_spike" target="_blank" rel="noopener noreferrer">
            <Image
              src="/twitter.svg"
              alt="Twitter"
              width={30}
              height={30}
              className="hover:scale-110 hover:filter invert transition transform duration-200"
            />
          </a>
          <a href="https://t.me/supraspike" target="_blank" rel="noopener noreferrer">
            <Image
              src="/telegram.svg"
              alt="Telegram"
              width={30}
              height={30}
              className="hover:scale-110 hover:filter invert transition transform duration-200"
            />
          </a>
          <a href="https://discord.gg/XGpkEXGT" target="_blank" rel="noopener noreferrer">
            <Image
              src="/discord.svg"
              alt="Discord"
              width={30}
              height={30}
              className="hover:scale-110 hover:filter invert transition transform duration-200"
            />
          </a>
        </div>
        <Link
          href="/launchpad"
          className="bg-gradient-to-r mb-3 from-purple-400 to-orange-500 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-xl hover:from-yellow-300 hover:to-orange-400 transition duration-300 transform hover:scale-105 w-full md:w-auto"
          >
          LaunchPad
        </Link>
        {account ? (
  <div
    className="text-xs sm:text-sm bg-white text-purple-700 py-1 px-3 rounded-full font-mono cursor-pointer shadow-lg hover:shadow-purple-700 transition duration-300"
    onClick={() => setShowDisconnect(!showDisconnect)}
  >
    {shortAccount}
    {showDisconnect && (
      <button
        onClick={disconnectWallet}
        className="absolute top-50 left-0 bg-red-500 text-white py-2 px-4 rounded shadow-lg hover:bg-red-600 transition duration-300"
      >
        Disconnect
      </button>
    )}
  </div>
) : (
  <button
    onClick={connectWallet}
    className="bg-gradient-to-r from-purple-400 to-orange-500 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-xl hover:from-yellow-300 hover:to-orange-400 transition duration-300 transform hover:scale-105 w-full md:w-auto"
  >
    Connect
  </button>
)}

            


      </div>
      {/* Opciones principales */}
      <div className="md:flex items-center gap-6">
        {/* Botón para MemeFactory */}
        <Link
          href="/launchpad"
          className="hidden md:flex bg-gradient-to-r from-yellow-500 to-orange-700 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:from-yellow-300 hover:to-orange-400 hover:shadow-xl transition w-full md:w-auto text-center"
        >
          LaunchPad 🎨
        </Link>
        {/* Botón para MemeFactory */}
        <Link
          href="/memefactory"
          className="bg-gradient-to-r from-yellow-500 to-orange-700 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:from-yellow-300 hover:to-orange-400 hover:shadow-xl transition w-full md:w-auto text-center"
        >
          MemeFactory 🎨
        </Link>

        {/* Redes Sociales */}
        <div className="hidden  md:flex items-center justify-center gap-4 mt-2 md:mt-0">
          <a href="https://x.com/supra_spike" target="_blank" rel="noopener noreferrer">
            <Image
              src="/twitter.svg"
              alt="Twitter"
              width={30}
              height={30}
              className="hover:scale-110 hover:filter invert transition transform duration-200"
            />
          </a>
          <a href="https://t.me/supraspike" target="_blank" rel="noopener noreferrer">
            <Image
              src="/telegram.svg"
              alt="Telegram"
              width={30}
              height={30}
              className="hover:scale-110 hover:filter invert transition transform duration-200"
            />
          </a>
          <a href="https://discord.gg/VZZWvBJYMk" target="_blank" rel="noopener noreferrer">
            <Image
              src="/discord.svg"
              alt="Discord"
              width={30}
              height={30}
              className="hover:scale-110 hover:filter invert transition transform duration-200"
            />
          </a>
        </div>

        {/* Connect Wallet */}
        <div className="hidden md:flex relative mt-2 md:mt-0">
          {account ? (
            <div
              className="text-xs sm:text-sm bg-white text-purple-700 py-1 px-3 rounded-full font-mono cursor-pointer shadow-lg hover:shadow-purple-700 transition duration-300"
              onClick={() => setShowDisconnect(!showDisconnect)}
            >
              {shortAccount}
              {showDisconnect && (
                <button
                  onClick={disconnectWallet}
                  className="absolute top-10 left-0 bg-red-500 text-white py-2 px-4 rounded shadow-lg hover:bg-red-600 transition duration-300"
                >
                  Disconnect
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-purple-400 to-orange-500 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-xl hover:from-yellow-300 hover:to-orange-400 transition duration-300 transform hover:scale-105 w-full md:w-auto"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <button
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 py-6">
        <div className="flex-shrink-0">
          <Image
            src="/spike.jpg"
            alt="Spike Logo"
            width={150}
            height={150}
            className="rounded-full shadow-lg border-4 border-white"
          />
        </div>
        <div className="text-center sm:text-left max-w-md">
          <h1 className="text-4xl justify-center sm:text-6xl text-center sm:text-center mb-8 font-extrabold tracking-tight text-pink-100">
            Supra Spike Airdrop 
          </h1>

          <p className="mt-4 text-lg sm:text-xl font-bold text-purple-100 leading-relaxed">
            🚀🦔 We are the <span className="text-yellow-300 font-extrabold">first memecoin</span> on the Supra network. Join our amazing community and be part of the <span className="font-bold text-pink-300">Supra Alunization</span>. 🦔💜
          </p>

          <div className="mt-6">
            <div className="bg-purple-100 text-purple-700 p-4 sm:p-6 rounded-lg shadow-md">
              <ApproveTransaction />
              <Airdrop />
            </div>
          </div>

          {!isInstalled && (
            <p className="text-white text-sm sm:text-lg mt-6">
              *StarKey Wallet is not installed. Please install it{' '}
              <a
                href="https://starkey.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-yellow-300 hover:text-yellow-400 transition duration-300"
              >
                here
              </a>
              .
            </p>
          )}

          {errorMessage && <p className="text-red-500 font-bold mt-4">{errorMessage}</p>}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 bg-purple-900 text-center text-xs sm:text-sm text-purple-200">
        <p>Made with ❤️ in Supra network</p>
      </footer>
    </div>
  );
}
