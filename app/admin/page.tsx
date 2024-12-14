"use client";

import { useState, useEffect, useCallback } from "react";
import {BCS} from "aptos";
import Big from "big.js";

export default function Admin() {
    
  const [account, setAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [memeContract, setMemeContract] = useState("");
  const [amount, setAmount] = useState("");
  const [amountMore, setAmountMore] = useState("");
  const [per_req, setPer_req] = useState("");
  const [changePeriod, setchangePeriod] = useState("");
  const [changePerReq, setchangePerReq] = useState("");
  const [lapse, setLapse] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<any>(null);

  const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";
  //const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::meme_spike::SPIKE"; //TESTNET
  const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE"; //MAINNET


  const getProvider = useCallback(() => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window as any)?.starkey.supra;
      setProvider(starkeyProvider);
      return starkeyProvider || null;
    }
    return null;
  }, []);
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
    const starkeyProvider = getProvider();
    if (!starkeyProvider) {
      console.error("Provider not available");
      return;
    }
  
  }, [getProvider]);

  const shortAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  const createAirdrop = async () => {
    const starkeyProvider = getProvider();
    if (!starkeyProvider) {
      setError("StarKey Wallet is not installed or unsupported.");
      return;
    }

    const amount_deposit = parseInt(amount, 10);
    if (isNaN(amount_deposit) || amount_deposit <= 0) {
      setError("Please provide a valid integer amount.");
      return;
    }
    
    const per_request = parseInt(per_req, 10);
    if (isNaN(per_request) || per_request <= 0) {
      setError("Please provide a valid integer per_req.");
      return;
    }

    const period_lapse = parseInt(lapse, 10);
    if (isNaN(period_lapse) || period_lapse <= 0) {
      setError("Please provide a valid integer lapse.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const accounts = await starkeyProvider.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error("Unable to fetch the account address.");
      }

      const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
      const optionalTransactionPayloadArgs = { txExpiryTime };
      const rawTxPayload = [
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "faucet",
        "create_faucet",
        [                           
          memeContract,// Type (CoinType)
        ],
        [
          BCS.bcsSerializeUint64(Number(Big(amount_deposit*1000).toFixed(0,0))), //amount of tokens to deposit
          BCS.bcsSerializeUint64(Number(per_request*1000)), //amount of tokens per request
          BCS.bcsSerializeUint64(Number(period_lapse*60)) //period of time between claims

        ],
        optionalTransactionPayloadArgs,
      ];

      const transactionData = await starkeyProvider.createRawTransactionData(rawTxPayload);
      const networkData = await starkeyProvider.getChainId();
      
      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: networkData.chainId,
        value: "",
      };

      const tx = await starkeyProvider.sendTransaction(params);
      setResult(tx);
      setMemeContract("");
      setAmount("");
      setPer_req("");
      setLapse("");

    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const AddMoreToken = async () => {
    const starkeyProvider = getProvider();
    const amount_deposit_more = parseInt(amountMore, 10);
    if (isNaN(amount_deposit_more) || amount_deposit_more <= 0) {
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
            CONTRACT_ADDRESS,
            "faucet",
            "deposit",
            [                          
              CONTRACT_ADDRESS_MEME, // Type (CoinType)
            ],
            [
                BCS.bcsSerializeUint64(Number(Big(amount_deposit_more*1000).toFixed(0,0))), //amount to deposit in vault faucet
            ],
            optionalTransactionPayloadArgs
          ];
        
        const transactionData2 = await starkeyProvider.createRawTransactionData(rawTxPayload2);
        const networkData = await starkeyProvider.getChainId();

        const params = {
        data: transactionData2,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
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
  
  const ChangeSettings = async () => {
    const starkeyProvider = getProvider();
    const parsedchangePerReq = parseInt(changePerReq, 10);
    if (isNaN(parsedchangePerReq) || parsedchangePerReq <= 0) {
        setError("Please provide a valid integer amount.");
        return;
      }

    const parsedchangePeriod = parseInt(changePeriod, 10);
    if (isNaN(parsedchangePeriod) || parsedchangePeriod <= 0) {
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
            CONTRACT_ADDRESS,
            "faucet",
            "change_settings",
            [                           // Type (CoinType)
              CONTRACT_ADDRESS_MEME,
            ],
            [
                BCS.bcsSerializeUint64(Number(Big(parsedchangePerReq*1000).toFixed(0,0))), //per request
                BCS.bcsSerializeUint64(Number(parsedchangePeriod*60)), //period in minutes

            ],
            optionalTransactionPayloadArgs
          ];
        
        const transactionData2 = await starkeyProvider.createRawTransactionData(rawTxPayload2);
        const networkData = await starkeyProvider.getChainId();

        const params = {
        data: transactionData2,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
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
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-purple-700 via-pink-600 to-yellow-500 text-white font-sans">
  <header className="flex items-center justify-between p-6 shadow-lg bg-purple-900">
    <h1 className="text-4xl font-extrabold text-yellow-300 tracking-wide">🌟 Meme Token Airdrop 🎉</h1>
    <div className="flex items-center gap-4 relative">
      {account ? (
        <div
          className="relative text-sm bg-yellow-300 text-purple-900 py-2 px-4 rounded-full font-mono cursor-pointer shadow-lg hover:shadow-yellow-500 transition"
          onClick={() => setShowDisconnect(!showDisconnect)}
        >
          {shortAccount}
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
          className="bg-yellow-300 text-purple-900 font-bold py-2 px-6 rounded-full shadow-lg transition-all hover:bg-yellow-400 hover:shadow-xl"
        >
          Connect Wallet
        </button>
      )}
    </div>
  </header>

  <main className="flex flex-col items-center justify-center px-5 space-y-16 mt-10">
    <section className="w-full max-w-xl bg-purple-800 rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-yellow-300 mb-6">🎁 Create Your Airdrop</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Meme Contract Address"
          value={memeContract}
          onChange={(e) => setMemeContract(e.target.value.trim())}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
        />
        <input
          type="text"
          placeholder="Amount to Deposit"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
        />
        <input
          type="text"
          placeholder="Amount per Request"
          value={per_req}
          onChange={(e) => setPer_req(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
        />
        <input
          type="text"
          placeholder="Wait Period Lapse (minutes)"
          value={lapse}
          onChange={(e) => setLapse(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
        />
      </div>
      <button
        onClick={createAirdrop}
        disabled={isLoading}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-lg mt-6 transition-all transform shadow-lg ${
          isLoading
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-yellow-300 text-purple-900 hover:bg-yellow-400 hover:shadow-xl active:scale-95"
        }`}
      >
        {isLoading ? "Processing..." : "Create Airdrop"}
      </button>
    </section>

    {result && (
      <div className="w-full max-w-xl bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-md">
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

    {error && (
      <div className="w-full max-w-xl bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
        <p>
          <strong>Error:</strong> {error}
        </p>
      </div>
    )}

    <section className="w-full max-w-xl bg-purple-800 rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-yellow-300 mb-6">➕ Add More Tokens</h2>
      <input
        type="text"
        placeholder="Add More Tokens"
        value={amountMore}
        onChange={(e) => setAmountMore(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
      />
      <button
        onClick={AddMoreToken}
        className="w-full px-6 py-3 mt-6 bg-yellow-300 text-purple-900 rounded-lg shadow-lg font-semibold text-lg transition-all transform hover:bg-yellow-400 hover:shadow-xl"
      >
        Add Tokens
      </button>
    </section>

    <section className="w-full max-w-xl bg-purple-800 rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-yellow-300 mb-6">⚙️ Change Settings</h2>
      <input
        type="text"
        placeholder="Amount Per Request"
        value={changePerReq}
        onChange={(e) => setchangePerReq(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
      />
      <input
        type="text"
        placeholder="Wait Period (minutes)"
        value={changePeriod}
        onChange={(e) => setchangePeriod(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
      />
      <button
        onClick={ChangeSettings}
        className="w-full px-6 py-3 mt-6 bg-yellow-300 text-purple-900 rounded-lg shadow-lg font-semibold text-lg transition-all transform hover:bg-yellow-400 hover:shadow-xl"
      >
        Update Settings
      </button>
    </section>
  </main>
</div>


  );
  
}
