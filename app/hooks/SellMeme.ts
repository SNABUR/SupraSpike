import { useState } from 'react';
import { useWallet } from "../context/walletContext"; 
import { BCS } from 'aptos';
import Big from 'big.js';

const useSellMeme = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider, walletAddress } = useWallet(); 
  
  const CONTRACT_ADDRESS = "0x8ca3b113f2078264e479af7f548e113731d626878cfcfe9f2f2bd12b53741d32";
  //const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::meme_spike::SPIKE"; //TESTNET

  
  const SellMeme = async (memeName:string, memeSymbol:string, SellAmount:string) => {
    try {
        setIsLoading(true);
        setError(null);

        const memeSymbolUpper = memeSymbol.toUpperCase();
      const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; 
      const optionalTransactionPayloadArgs = { txExpiryTime };
      const rawTxPayload = [
        walletAddress,
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "sell",
        [], 
        [
          BCS.bcsSerializeStr(memeName), 
          BCS.bcsSerializeStr(memeSymbolUpper),
          BCS.bcsSerializeUint64(Number(Big(Number(SellAmount) * 100000000).toFixed(0, 0))), 
        ],
        optionalTransactionPayloadArgs
      ];

      setIsLoading(true);
      setError(null);
  
      const transactionData = await provider.createRawTransactionData(rawTxPayload);
      const networkData = await provider.getChainId();
      console.log("networkData", networkData);
  
      const params = {
        data: transactionData,
        from: walletAddress,
        to: CONTRACT_ADDRESS,
        chainId: networkData.chainId,
        value: "",
      };
  
      const tx = await provider.sendTransaction(params);
      if (!tx) {
        console.error("Transaction is empty.");
        return; 
      }
      console.log("networkData.chainId", networkData.chainId);

      console.log("Transaction sent:", tx);
      setResult(tx);
    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { SellMeme, isLoading, error, result };
};

export default useSellMeme;
