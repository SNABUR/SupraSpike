"use client";

import { useState, useEffect, useCallback } from "react";
import {BCS, TxnBuilderTypes} from "aptos";
import Big from "big.js";

export default function Admin() {
    
  const [account, setAccount] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [contractAddressMeme, setContractAddressMeme] = useState("");

  const CONTRACT_TRANSFER_ADDRESS = "0x6e3e09ab7fd0145d7befc0c68d6944ddc1a90fd45b8a6d28c76d8c48bed676b0";
  //const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::meme_spike::SPIKE"; //TESTNET
  const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE"; //MAINNET

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS_MEME).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => console.error("Failed to copy: ", err)
    );
  };

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

  const resetWalletData = () => {
    setAccount("");
  };

  const disconnectWallet = async () => {
    const provider = await getProvider();
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


  useEffect(() => {
    const starkeyProvider = getProvider();
    if (!starkeyProvider) {
      console.error("Provider not available");
      return;
    }
  
  }, [getProvider]);

  const shortAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";


    
  const TransferCoins = async () => {
    const starkeyProvider = await getProvider();
    const parsedDeposit = parseInt(depositAmount, 10);
    if (isNaN(parsedDeposit) || parsedDeposit <= 0) {
      setError("Please provide a valid integer amount.");
      return;
    }
    console.log(parsedDeposit*1000,"amount of tokens to buy");
    console.log("Receptor (reciever):", recipientAddress);
    console.log("Cantidad (amount):", Number(Big(parsedDeposit * 1000).toFixed(0, 0)));

    try {
        const accounts = await starkeyProvider.connect();
        const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
        const optionalTransactionPayloadArgs = { txExpiryTime };
        const rawTxPayload2 = [
            accounts[0],
            0,
            CONTRACT_TRANSFER_ADDRESS,
            "TransferCoin",
            "transfer_coins",
            [
              contractAddressMeme
            ],
            [
              BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(recipientAddress)), //recipient
              BCS.bcsSerializeUint64(Number(Big(parsedDeposit*1000).toFixed(0,0))), //amount tokens Spike to send
            ],
            optionalTransactionPayloadArgs
          ];
          console.log("Raw Tx Payload:", rawTxPayload2);

        const transactionData2 = await starkeyProvider.createRawTransactionData(rawTxPayload2);
        const networkData = await starkeyProvider.getChainId();

        const params = {
        data: transactionData2,
        from: accounts[0],
        to: CONTRACT_TRANSFER_ADDRESS,
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
  


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 via-pink-600 to-yellow-500 text-white font-sans">
      <header className="flex items-center justify-between p-6 shadow-lg bg-purple-900">
        <h1 className="text-4xl font-extrabold text-yellow-300 tracking-wide">🌟 Meme Token Transfer 🎉</h1>
        <div className="flex items-center gap-2 relative">
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

      <main className="flex flex-col items-center justify-center px-5 space-y-7 mt-7">

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

        <section className="w-full max-w-xl bg-purple-800 rounded-lg space-y-3 shadow-xl p-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6">⚙️ Transfer Tokens on SUPRA</h2>
          <div className="flex flex-fil">
          <input
            type="text"
            placeholder="Contract Address"
            value={contractAddressMeme}
            onChange={(e) => setContractAddressMeme(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
          />
          <div>
          </div>
          </div>
          <p className="text-yellow-300">Recipient Address:</p>

          <div className="flex flex-fil">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
          />
          <div>
          </div>
          </div>
          <p className="flex h-auto justify-start text-yellow-300 ">Amount:</p>

          <div className="flex flex-fil mb-7 gap-3">
          <input
            type="number"
            placeholder="Amount To Transfer"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 text-black shadow-md"
          />
          <div>
            <button className="w-full px-6 py-3 bg-yellow-300 text-purple-900 rounded-lg shadow-lg font-semibold text-lg transition-all transform hover:bg-yellow-400 hover:shadow-xl"
            onClick={() => setDepositAmount("1")}>
              min
            </button>
          </div>
          </div>
          <button
            onClick={TransferCoins}
            className="w-full px-6 py-3  bg-yellow-300 text-purple-900 rounded-lg shadow-lg font-semibold text-lg transition-all transform hover:bg-yellow-400 hover:shadow-xl"
          >
            Transfer Coins
          </button>
        </section>

        <div className="text-2xl font-bold text-yellow-300">
          Spike Contract
        </div>
        <div className="flex items-center justify-center gap-2 mt-1 mb-3 bg-purple-200 text-purple-800 px-6 py-3 rounded-lg shadow-md">
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
      </main>
    </div>
  );
  
}
