"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ApproveTransaction from "./components/approve";

export default function Home() {
  const [account, setAccount] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE";

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => console.error("Failed to copy: ", err)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-pink-500 text-white font-sans">
      <header className="flex items-center justify-between p-6">
        <Image
          src="/spike.jpg"
          alt="Spike Logo"
          width={50}
          height={50}
          className="rounded-full shadow-lg"
        />
        <div className="flex items-center gap-4 relative">
          {account ? (
            <div
              className="text-sm bg-white text-purple-700 py-1 px-3 rounded-full font-mono cursor-pointer shadow-lg hover:shadow-purple-700 transition"
              onClick={() => setShowDisconnect(!showDisconnect)}
            >
              {shortAccount}
              {showDisconnect && (
                <button
                  onClick={disconnectWallet}
                  className="absolute top-10 left-0 bg-red-500 text-white py-1 px-3 rounded shadow-lg hover:bg-red-600"
                >
                  Disconnect
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all hover:bg-purple-800 hover:shadow-lg"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="flex flex-col items-center justify-center p-6 text-center">
        <Image
          src="/spike.jpg"
          alt="Spike Logo"
          width={200}
          height={200}
          className="rounded-full shadow-lg"
        />
        <h1 className="text-4xl font-bold mt-4">Spike Meme</h1>
        <p className="text-lg mt-2">Have fun and connect with Supra Oracles</p>
        <div className="mt-6 w-full max-w-lg">
          <p className="text-lg font-semibold">Contract Address:</p>
          <div className="flex items-center gap-2 mt-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg shadow-md w-full">
            <span className="truncate">{CONTRACT_ADDRESS}</span>
            <button
              onClick={copyToClipboard}
              className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-800"
            >
              Copy
            </button>
          </div>
          {copySuccess && (
            <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
          )}
        </div>

        {!isInstalled && (
          <p className="text-red-300 mt-6">
            StarKey Wallet is not installed. Please install it{" "}
            <a
              href="https://starkey.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-yellow-300"
            >
              here
            </a>
            .
          </p>
        )}

        {errorMessage && <p className="text-red-500 font-bold mt-4">{errorMessage}</p>}

        <ApproveTransaction />
      </main>

      <footer className="mt-10 text-center text-sm">
        <p>
          Made with ❤️ for the Supra network and the meme{" "}
          <span className="font-bold">Spike</span>
        </p>
      </footer>
    </div>
  );
}
