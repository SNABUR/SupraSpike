import { useState } from 'react';
import { BCS } from "aptos";
import { useWallet } from "../context/walletContext"; 

const useCreateMemeTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider } = useWallet(); 
  const CONTRACT_ADDRESS = "0x8ca3b113f2078264e479af7f548e113731d626878cfcfe9f2f2bd12b53741d32";

  const createMeme = async (memeName: string, memeSymbol: string, description:string, image:any, website: string, telegram:string, twitter:string ) => {
    let CID = "";
    try {
      if (!provider) {
        setError("StarKey Wallet is not installed or unsupported.");
        return;
      }
      if (!memeName || !memeSymbol) {
        setError("Please fill all fields.");
        return;
      }

      const uppersymbol = memeSymbol.toUpperCase();

      setIsLoading(true);
      setError(null);
      console.log("pass here")
      const accounts = await provider.connect();
      const transactionData = await provider.createRawTransactionData([
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "deploy",
        [],
        [
          BCS.bcsSerializeStr(description), 
          BCS.bcsSerializeStr(memeName), 
          BCS.bcsSerializeStr(uppersymbol), 
          BCS.bcsSerializeStr("URI"), 
          BCS.bcsSerializeStr(website), 
          BCS.bcsSerializeStr(telegram), 
          BCS.bcsSerializeStr(twitter), 
        ],
        { txExpiryTime: Math.ceil(Date.now() / 1000) + 30 },
      ]);


      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: 6,
      };

      const tx = await provider.sendTransaction(params);

      if (tx) {
        setResult(tx);

          if (image) {
          const formData = new FormData();
          formData.append('file', image);

            const response = await fetch('/api/save_image', {
                method: 'POST',
                body: formData,
            });

            if (!response || !response.ok) {
                throw new Error(`Error in image upload: ${response?.statusText || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('Image upload response:', data);
          }
      }

    console.log("Transaction successful:", tx);
    


      console.log("Transaction successful:", tx);
    } catch (err) {
      console.error("Error creating memecoin:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { createMeme, isLoading, error, result };
};

export default useCreateMemeTransaction;
