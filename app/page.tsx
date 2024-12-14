"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ApproveTransaction from "./components/approve";
import Airdrop from "./components/Airdrop";

export default function Home() {
  const [account, setAccount] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [activeTab, setActiveTab] = useState("approve"); // State to control active tab

  const CONTRACT_ADDRESS =
    "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE";

  const getProvider = () => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const provider = (window as any)?.starkey.supra;
      if (provider) {
        setIsInstalled(true);
        return provider;
      }
    }
    setIsInstalled(false);
    window.open("https://starkey.app/", "_blank");
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
      <header className="flex items-center justify-between px-6 py-4 bg-purple-800 shadow-md">
        <div className="flex items-center gap-4">
          <Image
            src="/spike.jpg"
            alt="Spike Logo"
            width={50}
            height={50}
            className="rounded-full shadow-lg"
          />
          <h1 className="text-2xl font-bold tracking-wide">Spike</h1>
        </div>
        <div className="relative">
          {account ? (
            <div
              className="text-sm bg-white text-purple-700 py-1 px-3 rounded-full font-mono cursor-pointer shadow-lg hover:shadow-purple-700 transition duration-300"
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
            className="bg-gradient-to-r from-purple-400 to-orange-500 text-white font-extrabold py-3 px-8 rounded-full shadow-xl hover:from-yellow-300 hover:to-orange-400 transition duration-300 transform hover:scale-105"
          >
            Connect Wallet
          </button>

          )}
        </div>
      </header>
  
      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 p-6">
        <div className="flex-shrink-0">
          <Image
            src="/spike.jpg"
            alt="Spike Logo"
            width={200}
            height={200}
            className="rounded-full shadow-lg border-4 border-white"
          />
        </div>
        <div className="text-center md:text-left max-w-lg">
        <h1 className="text-6xl text-center mb-12 font-extrabold tracking-tight text-pink-100">
          Supra Spike 🦔
        </h1>

        <p className="mt-4 text-5lg font-bold text-purple-100 leading-relaxed">
          🚀 We are the <span className="text-yellow-300 font-extrabold">first memecoin</span> on the Supra network. Join our amazing community and be part of the <span className="font-bold text-pink-300">Supra Alunization</span>. 💜
        </p>

        <p className="mt-4 text-3lg font-bold text-purple-100 leading-relaxed">
          🌟 <span className="text-pink-300">Spike</span> is the most <span className="text-yellow-300">adorable</span> and <span className="text-pink-300">brave</span> memecoin! 🦔✨
        </p>



  
          <div className="mt-6">
            <div className="bg-purple-100 text-purple-700 p-6 rounded-lg shadow-md">
              <ApproveTransaction />
              <Airdrop />
            </div>
          </div>
  
          {!isInstalled && (
            <p className="text-red-300 mt-6">
              StarKey Wallet is not installed. Please install it{' '}
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
      <footer className="py-6 bg-purple-900 text-center text-sm text-purple-200">
        <p>
          Made with ❤️ in Supra network{' '}
        </p>
      </footer>
    </div>
  );
  
  
  
}
