import { useState } from 'react';
import { BCS } from "aptos";

const useCreateMemeTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);


  const createMemeTransaction = async (provider:any, memeName:any, memeSymbol:any, URI:any) => {
    const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";
    try {
      if (!provider) {
        setError("StarKey Wallet is not installed or unsupported.");
        return;
      }
      if (!memeName || !memeSymbol) {
        setError("Please fill all fields.");
        return;
      }

      setIsLoading(true);
      setError(null);

      const accounts = await provider.connect();
      const transactionData = await provider.createRawTransactionData([
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "deploy",
        [],
        [
          BCS.bcsSerializeStr("this is a meme"), // meme description
          BCS.bcsSerializeStr(memeName), // meme name
          BCS.bcsSerializeStr(memeSymbol), // meme SYMBOL
          BCS.bcsSerializeStr(URI), // URI JSON
          BCS.bcsSerializeStr("www.supraaspike.fun"), // WEBSITE
          BCS.bcsSerializeStr("t.me/xd"), // TELEGRAM
          BCS.bcsSerializeStr("twitter.com/spike"), // TWITTER
        ],
        { txExpiryTime: Math.ceil(Date.now() / 1000) + 30 },
      ]);

      const networkData = await provider.getChainId();
      console.log(networkData, "chain id");

      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: 6,
      };

      const tx = await provider.sendTransaction(params);
      setResult(tx);
      console.log("Transaction successful:", tx);
    } catch (err) {
      console.error("Error creating memecoin:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { createMemeTransaction, isLoading, error, result };
};

export default useCreateMemeTransaction;