import { useState } from 'react';
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import { BCS } from 'aptos';
import Big from 'big.js';

const useBuyMeme = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider, walletAddress } = useWallet(); // Obtén el provider desde el contexto
  
  const CONTRACT_ADDRESS = "0x6110f7805e01a3b4f90c1c7fb42a78c5790441a6a39b389aef0f39fd5185471d";
  //const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::meme_spike::SPIKE"; //TESTNET

  
  const BuyMeme = async (memeName:string, memeSymbol:string, BuyAmount:string) => {
    try {
        setIsLoading(true);
        setError(null);
        
      const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
      const optionalTransactionPayloadArgs = { txExpiryTime };
      const upperCaseMemeSymbol = memeSymbol.toUpperCase();
      console.log(memeName, upperCaseMemeSymbol, "meme name and symbol")
      const rawTxPayload = [
        walletAddress,
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "buy",
        [], // Arguments for the mint function
        [
          BCS.bcsSerializeStr(memeName), // meme description
          BCS.bcsSerializeStr(upperCaseMemeSymbol), // meme SYMBOL
          BCS.bcsSerializeUint64(Number(Big(Number(BuyAmount) * 100000000).toFixed(0, 0))), //amount tokens Spike to buy
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
        return; // Detener ejecución si `tx` está vacío
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

  return { BuyMeme, isLoading, error, result };
};

export default useBuyMeme;
