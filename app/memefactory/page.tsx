"use client";

import { useState, useEffect, useCallback } from "react";
import { BCS, TxnBuilderTypes } from "aptos";
import Image from "next/image";
import Link from "next/link";


export default function Memefactory() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [memeName, setMemeName] = useState("");
  const [memeSymbol, setMemeSymbol] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [URI, setURI] = useState("");
  const [projectURL, setprojectURL] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const CONTRACT_ADDRESS = "0x6e3e09ab7fd0145d7befc0c68d6944ddc1a90fd45b8a6d28c76d8c48bed676b0";
  const CONTRACT_ADDRESS_MEME = `${CONTRACT_ADDRESS}::meme_factory_test::create_token`;
  //const CONTRACT_ADDRESS_MEME = "0x6e3e09ab7fd0145d7befc0c68d6944ddc1a90fd45b8a6d28c76d8c48bed676b0::meme_factory_test::create_token"; //MAINNET


  const getProvider = () => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const provider = (window as any)?.starkey?.supra;
      if (provider) {
        setProvider(provider);
        setIsInstalled(true);
        return provider;
      }
    }
    setIsInstalled(false);
    setProvider(null);
    return null;
  };
  
  useEffect(() => {
    getProvider();
  }, []);
  

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.connect();
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          throw new Error("No accounts found.");
        }
      } catch (error) {
        setError("Connection rejected by the user.");
      }
    } else {
      setError("Provider not initialized.");
    }
  };
  
  const resetWalletData = () => {
    setAccount("");
  };


  const disconnectWallet = async () => {
    if (provider) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
    resetWalletData();
  };

  const createMeme = async () => {
    if (!provider) {
      setError("StarKey Wallet is not installed or unsupported.");
      return;
    }
    if (!memeName || !memeSymbol || !maxSupply) {
      setError("Please fill all fields.");
      return;
    }

    const parsedMaxSupply = parseInt(maxSupply, 10);
    if (isNaN(parsedMaxSupply) || parsedMaxSupply <= 0) {
      setError("Please provide a valid max supply.");
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log(memeName, "memename", memeSymbol, "symbol", parsedMaxSupply, "max supply")
    try {
      const accounts = await provider.connect();
      const transactionData = await provider.createRawTransactionData([
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "token_factory_1",
        "deploy_new_token",
        [],
        [
          BCS.bcsSerializeStr(memeName),
          BCS.bcsSerializeStr(memeSymbol),
          BCS.bcsSerializeUint64(parsedMaxSupply), // maximum_supply (u128)
          BCS.bcsSerializeU8(8), // decimals (u8)
          BCS.bcsSerializeStr(URI),
          BCS.bcsSerializeStr(projectURL),


        ],
        { txExpiryTime: Math.ceil(Date.now() / 1000) + 30 },
      ]);

      const networkData = await provider.getChainId();
      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: networkData.chainId,
        value: "",
      };

      const tx = await provider.sendTransaction(params);
      setResult(tx);
      //setMemeName("");
      //setMemeSymbol("");
      //setMaxSupply("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-200 to-purple-700 font-sans text-gray-800">
    {/* Header */}
    <header className="flex items-center justify-between p-6 bg-black shadow-md sticky top-0 z-10">
      <Link
        href="/"
        className="bg-gradient-to-r from-red-400 to-black-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:from-yellow-300 hover:to-orange-400 hover:shadow-xl transition"
      >
        Airdrop 🎨
      </Link>

      <div className="flex items-center gap-4">
        {account ? (
          <div className="relative">
            <div
              className="bg-pink-500 text-white py-2 px-4 rounded-full font-mono cursor-pointer shadow-md hover:shadow-lg transition"
              onClick={() => setShowDisconnect(!showDisconnect)}
            >
              {shortAccount}
            </div>
            {showDisconnect && (
              <button
                onClick={disconnectWallet}
                className="absolute top-12 left-0 bg-red-600 text-white py-2 px-4 rounded shadow-lg hover:bg-red-700 transition"
              >
                Disconnect
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-pink-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-pink-600 hover:shadow-lg transition"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  
    {/* Hero Section */}
    <main className="flex flex-col items-center justify-center px-4 py-10">
      <section className="text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-purple-600 mb-6">
          🚀 Create Your Memecoin!
        </h2>
        <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-6">
          (Testnet)
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Unleash your inner degen! 🚀
        </p>
      </section>
  
      {/* Form Section */}
      <section className="w-full max-w-xl mt-10 bg-white rounded-lg shadow-md p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Token Name"
            value={memeName}
            onChange={(e) => setMemeName(e.target.value.trim())}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm border border-pink-200"
          />
          <input
            type="text"
            placeholder="Symbol"
            value={memeSymbol}
            onChange={(e) => setMemeSymbol(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm border border-pink-200"
          />
          <input
            type="number"
            placeholder="Max Supply"
            value={maxSupply}
            onChange={(e) => setMaxSupply(e.target.value)}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm border border-pink-200"
          />
          <input
            type="text"
            placeholder="Image URI"
            value={URI}
            onChange={(e) => setURI(e.target.value)}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm border border-pink-200"
          />
          <input
            type="text"
            placeholder="Project URL"
            value={projectURL}
            onChange={(e) => setprojectURL(e.target.value)}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm border border-pink-200"
          />
        </div>
        <button
          onClick={createMeme}
          disabled={isLoading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-transform ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-pink-500 text-white hover:bg-pink-600 hover:shadow-xl active:scale-95"
          }`}
        >
          {isLoading ? "Creating Memecoin..." : "Create Memecoin"}
        </button>
      </section>
  
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
    </main>
    <Image
          src="/spike.jpg"
          alt="Spike Logo"
          width={40}
          height={40}
          className="w-60 mx-auto mb-6 rounded-full shadow-lg"
        />
  
    {/* Footer */}
    <footer className="py-6 text-center bg-purple-600 text-white text-sm">
      Made with ❤️ for Supra. ✨
    </footer>
  </div>
  
      );
}