"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {BCS} from "aptos";
import Big from "big.js";

export default function LaunchPad() {
  const [account, setAccount] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [joinDeposit, setJoinDeposit] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [progress, setProgress] = useState(400000694012300);
  const idoSupply = 5069000000000000;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS_MEME).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => console.error("Failed to copy: ", err)
    );
  };

  const CURRENCY = "0x1::supra_coin::SupraCoin"
  const price_meme = 0.0000000026;
  
  const CONTRACT_ADDRESS_IDO = "0x6e3e09ab7fd0145d7befc0c68d6944ddc1a90fd45b8a6d28c76d8c48bed676b0";
  //const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::meme_spike::SPIKE"; //TESTNET
  const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE"; //MAINNET

  const getProvider = useCallback(async () => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window as any)?.starkey.supra;
      setProvider(starkeyProvider);

      if (starkeyProvider) {
        const currentNetwork = await starkeyProvider.getChainId();
        if (currentNetwork.chainId !== 8) {
          await starkeyProvider.changeNetwork({ chainId: 8 });
          console.log("Network changed to chainId 8");
        }
      }

      return starkeyProvider || null;
    }
    return null;
  }, []);

  useEffect(() => {
    getProvider();
  }, [getProvider]);

  const connectWallet = async () => {
    try {
      if (!provider) return;
      const accounts = await provider.connect();
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (provider) await provider.disconnect();
      setAccount("");
      setShowDisconnect(false);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

    const JoinIDO = async () => {
      if (!account) {
        await connectWallet();
        if (!account) {
          setError("Please connect your wallet to proceed.");
          return; // Detenemos el flujo
        }
      }
      const starkeyProvider = await getProvider();
            // Verificar si la wallet está conectada


      const parsedjoinDeposit = parseInt(joinDeposit, 10);
      if (isNaN(parsedjoinDeposit) || parsedjoinDeposit <= 0) {
        setError("Please provide a valid integer amount.");
        return;
      }
      try {
          const accounts = await starkeyProvider.connect();
          const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
          const optionalTransactionPayloadArgs = { txExpiryTime };
          const rawTxPayload2 = [
              accounts[0],
              0,
              CONTRACT_ADDRESS_IDO,
              "ido",
              "joinIdo",
              [                          
                CURRENCY,
                CONTRACT_ADDRESS_MEME, // Type (CoinType)
              ],
              [
                //BCS.bcsSerializeUint64(Number(Big(parsedjoinDeposit*1).toFixed(0,0))), //amount to deposit in vault faucet
                BCS.bcsSerializeUint64(Number(Big(parsedjoinDeposit*1000/price_meme).toFixed(0,0))), //amount tokens Spike to buyt
              ],
              optionalTransactionPayloadArgs
            ];
          
          const transactionData2 = await starkeyProvider.createRawTransactionData(rawTxPayload2);
          const networkData = await starkeyProvider.getChainId();
  
          const params = {
          data: transactionData2,
          from: accounts[0],
          to: CONTRACT_ADDRESS_IDO,
          chainId: networkData.chainId,
          value: "",
          };
  
          const tx = await starkeyProvider.sendTransaction(params);
  
      } catch (err) {
          console.error("Error sending tokens:", err);
          setError(err instanceof Error ? err.message : "Unknown error occurred.");
      } finally {
          setIsLoading(false);
      }
    };

  const ClaimTokens = async () => {
  // Si la wallet no está conectada
  if (!account) {
    await connectWallet();
    if (!account) {
      setError("Please connect your wallet to claim tokens.");
      return; // Detenemos el flujo
    }
  }
    const starkeyProvider = await getProvider();

    try {
        const accounts = await starkeyProvider.connect();
        const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
        const optionalTransactionPayloadArgs = { txExpiryTime };
        const rawTxPayload2 = [
            accounts[0],
            0,
            CONTRACT_ADDRESS_IDO,
            "ido",
            "claim",
            [ 
              CURRENCY,
              CONTRACT_ADDRESS_MEME
            ], // Type (CoinType)],
            [],
            optionalTransactionPayloadArgs
          ];
        
        const transactionData2 = await starkeyProvider.createRawTransactionData(rawTxPayload2);
        const networkData = await starkeyProvider.getChainId();

        const params = {
        data: transactionData2,
        from: accounts[0],
        to: CONTRACT_ADDRESS_IDO,
        chainId: networkData.chainId,
        value: "",
        };

        const tx = await starkeyProvider.sendTransaction(params);

    } catch (err) {
        console.error("Error sending tokens:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  };


  const shortAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  return (
    <div className="items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 via-pink-300 to-red-400 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-7 py-4 bg-black shadow-lg sticky top-0 z-50">
        <Link
          href="/"
          className="bg-gradient-to-r from-yellow-500 to-orange-700 text-white font-bold py-2 px-3 rounded-full shadow-lg hover:from-yellow-300 hover:to-orange-400 hover:shadow-xl transition w-auto md:w-auto text-center text-sm sm:text-base lg:text-lg"
        >
          🚀 Spike Airdrop
        </Link>
        <div className="text-white font-extrabold text-lg sm:text-xl lg:text-2xl py-2 rounded-full shadow-md hover:from-pink-400 hover:to-purple-600 hover:shadow-lg transition">
    🌟    Launchpad
        </div>
        <div className="flex items-center gap-4">
          {account ? (
            <div className="relative">
              <div
                className="bg-pink-600 text-white px-4 py-2 rounded-full cursor-pointer shadow hover:shadow-md transition text-sm sm:text-base"
                onClick={() => setShowDisconnect(!showDisconnect)}
              >
                {shortAccount}
              </div>
              {showDisconnect && (
                <button
                  onClick={disconnectWallet}
                  className="absolute top-12 left-0 bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 text-sm sm:text-base"
                >
                  Disconnect
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition text-sm sm:text-base lg:text-lg"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>
    
      {/* Main Content Wrapper */}
      <div className="flex flex-col max-w-5xl mx-auto items-center justify-center h-auto border border-gray-300 rounded-xl bg-gradient-to-br from-yellow-100 via-pink-200 to-red-300 shadow-2xl p-6 space-y-7">
        {/* Hero Section */}
        <section className="py-3 text-center w-full">
          <div className="max-w-4xl mx-auto px-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-pink-600 mb-7 drop-shadow-md">
              🎉 SUPRA SPIKE 🎉
            </h1>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-7">
  Be part of history with <span className="font-bold text-pink-500">Spike</span>, the first-ever memecoin on the lightning-fast <span className="font-bold text-pink-500">Supra Oracles</span> blockchain! Powered by 400,000 TPS, Spike the hedgehog is speeding into the future of memes. Don't miss your chance to join the movement—get your SPIKE tokens now!
</p>

            <div className="flex justify-center gap-3">
              <Link href="/">
                <button className="bg-white text-pink-800 font-bold px-6 py-3 rounded-full shadow hover:shadow-lg transition text-sm sm:text-base">
                  📄 website
                </button>
              </Link>
              <Link href="https://twitter.com/supra_spikes" target="_blank">
                <button className="bg-black text-white font-bold px-6 py-3 rounded-full shadow hover:scale-110 hover:shadow-lg transition text-sm sm:text-base">
                  🐦 Twitter
                </button>
              </Link>
            </div>
          </div>
        </section>
    
        {/* Token Info Section */}
        <section className="py-3 w-auto">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 p-3">
              {/* Imagen */}
              <div className="flex justify-center lg:justify-start">
                <Image
                  src="/supraspike.jpg"
                  alt="SPIKE Meme"
                  width={260}
                  height={360}
                  className="rounded-3xl shadow-md hover:scale-105 transition-transform"
                />
              </div>
    
              {/* Información */}
              <div className="text-gray-700 space-y-7">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-pink-600 text-center lg:text-left">
                  📊 Token Information
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1 mb-1 bg-purple-200 text-purple-800 px-3 py-1 rounded-lg shadow-md">
                  Contract:
                  <span className="font-mono text-sm">
                    {CONTRACT_ADDRESS_MEME.slice(0, 7)}...{CONTRACT_ADDRESS_MEME.slice(-12)}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-purple-700 text-white px-4 py-1 rounded-md hover:bg-purple-800 transition"
                  >
                    Copy
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-pink-100 rounded-lg shadow">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-pink-700">
                      Token Chain:
                      <span className="block text-pink-900 text-base sm:text-lg lg:text-xl">Supra</span>
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg shadow">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-yellow-700">
                      Total Supply:
                      <span className="block text-yellow-900 text-base sm:text-lg lg:text-xl">13,700 T</span>
                    </p>
                  </div>
                  <div className="p-4 bg-pink-100 rounded-lg shadow">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-pink-700">
                      Start:
                      <span className="block text-pink-900 text-base sm:text-lg lg:text-xl">18/12/2025</span>
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg shadow">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-yellow-700">
                      End:
                      <span className="block text-yellow-900 text-base sm:text-lg lg:text-xl">18/01/2025</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    
        {/* Buy & Claim Section */}
        <section className="py-3 w-full">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buy Section */}
            <div className="bg-pink-50 p-6 rounded-xl shadow-md">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-pink-600 text-center mb-3">💰$SPIKE IDO</h2>
              <div className=" text-gray-700 text-sm sm:text-base lg:text-lg mb-1">
                Deposit SUPRA to join:
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={joinDeposit}
                  onChange={(e) => setJoinDeposit(e.target.value)}
                  className="border border-pink-300 p-3 mb-3 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-pink-500 w-full text-sm sm:text-base"
                />
                <p className="text-black font-bold text-sm sm:text-base">SUPRA</p>
              </div>
              <div className="text-gray-700 text-sm sm:text-base lg:text-lg mb-6">
                ~ {Number((Number(joinDeposit) * 1000) / (price_meme * 1000)).toLocaleString(undefined, { maximumFractionDigits: 0 })} SPIKE
              </div>

    
              <div className="grid grid-cols-4 gap-2 mb-6">
                <button className="bg-yellow-400 text-pink-800 font-bold py-2 rounded-full shadow hover:scale-105 hover:shadow-md transition text-sm sm:text-base"
                  onClick={() => setJoinDeposit("1")}>
                  Min
                </button>
                <button className="bg-yellow-400 text-pink-800 font-bold py-2 rounded-full shadow hover:scale-105 hover:shadow-md transition text-sm sm:text-base"
                  onClick={() => setJoinDeposit("1500")}>
                  25%
                </button>
                <button className="bg-yellow-400 text-pink-800 font-bold py-2 rounded-full shadow hover:scale-105 hover:shadow-md transition text-sm sm:text-base"
                  onClick={() => setJoinDeposit("3170")}>
                  50%
                </button>
                <button className="bg-yellow-400 text-pink-800 font-bold py-2 rounded-full shadow hover:scale-105 hover:shadow-md transition text-sm sm:text-base"
                  onClick={() => setJoinDeposit("6214")}>
                  Max
                </button>
              </div>
              <button className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white py-5 px-7 rounded-full shadow-xl font-extrabold text-lg sm:text-xl lg:text-2xl hover:scale-110 hover:shadow-2xl transition transform duration-200 w-full"
                onClick={JoinIDO}>
                Join SPIKE IDO
              </button>

            </div>
    
            {/* Claim Section */}
            <div className="bg-pink-50 p-7 rounded-xl shadow-md flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-pink-600 font-extrabold text-center mb-4">🚀 Claim Your SPIKE</h2>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg text-center leading-relaxed mb-6 max-w-sm">
                If you've participated in the IDO, claim your SPIKE tokens now!
              </p>
              <button className="bg-gradient-to-r from-yellow-300 to-pink-700 text-white text-lg sm:text-xl lg:text-2xl font-extrabold py-5 px-7 rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition transform duration-200 w-full"
                onClick={ClaimTokens}>
                Claim Your $SPIKE!
              </button>

            </div>
          </div>
        </section>
    
        {/* Progress Section */}
        <section className="py-8 w-full">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-pink-600 mb-6">Progress</h2>
            <div className="relative w-full bg-gray-300 rounded-full h-6 overflow-hidden">
              <div
                className="absolute top-0 left-0 bg-gradient-to-r from-pink-500 to-yellow-400 h-6"
                style={{ width: progress/idoSupply * 100 + "%" }}
              ></div>
            </div>
            <p className="mt-4 font-bold text-gray-700 text-sm sm:text-base">{Math.round((progress * 100) / idoSupply)}% Sold</p>
            <p className="text-gray-500 text-sm sm:text-base">Tokens Sold: {progress} / {idoSupply}</p>
          </div>
        </section>
      </div>
    </div>
    );
    
  
  
}
