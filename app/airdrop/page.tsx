"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ApproveTransaction from "./components/approve";
import Airdrop from "./components/Airdrop";
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto

export default function Home() {
  const [account, setAccount] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [showMenu, setShowMenu] = useState(false);


  const shortAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-pink-500 text-white font-sans flex flex-col">


      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 py-6">
        <div className="flex-shrink-0">
          <Image
            src="/supraspike.jpg"
            alt="Spike Logo"
            width={150}
            height={150}
            className="rounded-full shadow-lg border-4 border-black"
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
