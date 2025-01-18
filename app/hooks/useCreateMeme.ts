import { useState } from 'react';
import { BCS } from "aptos";
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import { predictCID } from './predictCID';

const useCreateMemeTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider } = useWallet(); // Obtén el provider desde el contexto
  const CONTRACT_ADDRESS = "0x6110f7805e01a3b4f90c1c7fb42a78c5790441a6a39b389aef0f39fd5185471d";

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
      // Conectar con la wallet
      const accounts = await provider.connect();
      const transactionData = await provider.createRawTransactionData([
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "deploy",
        [],
        [
          BCS.bcsSerializeStr(description), // meme description
          BCS.bcsSerializeStr(memeName), // meme name
          BCS.bcsSerializeStr(uppersymbol), // meme SYMBOL
          BCS.bcsSerializeStr("URI"), // URI JSON
          BCS.bcsSerializeStr(website), // WEBSITE
          BCS.bcsSerializeStr(telegram), // TELEGRAM
          BCS.bcsSerializeStr(twitter), // TWITTER
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

      const mainAcc = accounts[0];
      const contractmeme = "kjvnsdkfjvn";
      const data_creation = Date.now;
      const network = "Supra";
      const uri = "data json";

      if (tx) {
        setResult(tx);
        await fetch("/api/create_meme", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ memeName, memeSymbol, contractmeme, CID, mainAcc, data_creation, website, twitter, telegram, description, network, uri, tx }),
        })
        .then((response) => {
            if (!response || !response.ok) {
                throw new Error(`Error in request: ${response?.statusText || 'Unknown error'}`);
            }
            return response.json();
        })
        .then((data) => {
          console.log('API response:', data);
          if (image) {
          const formData = new FormData();
          formData.append('file', image);

          return fetch('/api/save_image', {
              method: 'POST',
              body: formData,
          });
        };
        })
        .then((response) => {
            if (!response || !response.ok) {
                throw new Error(`Error in image upload: ${response?.statusText || 'Unknown error'}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Image upload response:', data);
        })
        .catch((error) => {
            console.error('Error calling the API:', error);
        });
    }
    


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
