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
  const [joinDeposit, setJoinDeposit] = useState("1");
  const [copySuccess, setCopySuccess] = useState(false);
  const [progress, setProgress] = useState(400000694012300);
  const idoSupply = 5069000000000000;
  const [showPopup, setShowPopup] = useState(false); // Controla la visibilidad del popup
  const [showPopup_2, setShowPopup_2] = useState(false); // Controla la visibilidad del popup
  const [txHash, setTxHash] = useState<string | null>(null); // Guarda el enlace de la transacción

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

          if (tx) {
            setTxHash(tx); // Store the transaction hash
            setShowPopup(true); // Show the pop-up only if txHash is valid
            console.log("Transaction successful:", tx);
          } else {
            console.error("No transaction hash received.");
            setError("Transaction failed: No TX hash received.");
          }
  
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

        if (tx) {
          setTxHash(tx); // Store the transaction hash
          setShowPopup_2(true); // Show the pop-up only if txHash is valid
          console.log("Transaction successful:", tx);
        } else {
          console.error("No transaction hash received.");
          setError("Transaction failed: No TX hash received.");
        }

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
        <section className="py-8 w-auto">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
              {/* Imagen */}
              <div className="flex justify-center lg:justify-end">
                <Image
                  src="/supraspike.jpg"
                  alt="SPIKE Meme"
                  width={371}
                  height={371}
                  className="rounded-3xl shadow-lg hover:scale-105 transition-transform"
                />
              </div>

              {/* Información */}
              <div className="text-gray-700 space-y-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-pink-600 text-center lg:text-left">
                  📊 Token Information
                </h2>

                {/* Contract */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 p-4 bg-purple-100 text-purple-800 rounded-lg shadow-md">
                  <span className="font-medium text-sm sm:text-base">Contract:</span>
                  <span className="font-mono text-sm sm:text-base bg-white px-3 py-1 rounded-md">
                    {CONTRACT_ADDRESS_MEME.slice(0, 7)}...{CONTRACT_ADDRESS_MEME.slice(-12)}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition"
                  >
                    Copy
                  </button>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-pink-100 rounded-lg shadow-lg text-center">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-pink-700">Token Chain:</p>
                    <span className="block text-pink-900 text-lg sm:text-xl lg:text-2xl font-extrabold">Supra</span>
                  </div>
                  <div className="p-6 bg-yellow-100 rounded-lg shadow-lg text-center">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-yellow-700">Total Supply:</p>
                    <span className="block text-yellow-900 text-lg sm:text-xl lg:text-2xl font-extrabold">13,700 T</span>
                  </div>
                  <div className="p-6 bg-pink-100 rounded-lg shadow-lg text-center">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-pink-700">Start:</p>
                    <span className="block text-pink-900 text-lg sm:text-xl lg:text-2xl font-extrabold">18/12/2025</span>
                  </div>
                  <div className="p-6 bg-yellow-100 rounded-lg shadow-lg text-center">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-yellow-700">End:</p>
                    <span className="block text-yellow-900 text-lg sm:text-xl lg:text-2xl font-extrabold">18/01/2025</span>
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
      
      {showPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
          onClick={() => setShowPopup(false)} // Cierra el popup al hacer clic fuera del contenido
        >
          <div 
            className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()} // Evita que el click dentro del popup cierre el modal
          >
            {/* Título del popup */}
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-green-600">
                🎉 Congratulations!
              </h2>
              <p className="text-gray-700">
                You just <span className="text-purple-600 font-bold">joined SPIKE IDO!</span>
              </p>
            </div>

            {/* Imagen opcional para reforzar el mensaje del meme */}
            <div className="mt-4">
            <img 
                src="https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif" 
                alt="Excited hedgehog" 
                className="mx-auto rounded-lg shadow-lg w-48"
              />
            </div>

            {/* Enlace a los detalles de la transacción */}
            <div className="mt-6">
              <a
                href={`https://suprascan.io/tx/${txHash}/f?tab=tx-advance`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700 transition"
              >
                🔗 View transaction details
              </a>
            </div>

            {/* Botón para cerrar el popup */}
            <div className="mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>

      )}

      {showPopup_2 && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
          onClick={() => setShowPopup_2(false)} // Cierra el popup al hacer clic fuera del contenido
        >
          <div 
            className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Evita que el click dentro del popup cierre el modal
          >
            {/* Título del popup */}
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-green-500">
                🎉 Spike Tokens Received!
              </h2>
              <p className="text-gray-700">
                You just <span className="text-purple-600 font-bold">claimed SPIKE IDO tokens!</span>
              </p>
            </div>

            {/* Imagen para enfatizar el mensaje */}
            <div className="mt-5">
            <img 
              src="https://media.giphy.com/media/EWIiv7izSd4J51tntS/giphy.gif" 
              alt="Dancing funny character" 
              className="mx-auto rounded-lg shadow-lg w-48"
            />

            </div>

            {/* Enlace a los detalles de la transacción */}
            <div className="mt-6">
              <a
                href={`https://suprascan.io/tx/${txHash}/f?tab=tx-advance`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold underline hover:text-blue-700 transition duration-200"
              >
                🔗 View Transaction Details
              </a>
            </div>

            {/* Botón para cerrar el popup */}
            <div className="mt-8">
              <button
                onClick={() => setShowPopup_2(false)}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-500 transition duration-200"
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
