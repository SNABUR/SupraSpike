import { useState } from 'react';
import { BCS } from "aptos";
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import { CID } from 'multiformats';
import * as dagPB from '@ipld/dag-pb'; // Importamos todo el módulo dag-pb
import { sha256 } from 'multiformats/hashes/sha2';

const useCreateMemeTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider } = useWallet(); // Obtén el provider desde el contexto
  const CONTRACT_ADDRESS = "0x2b96e17617714a76df603191cb44dce6684a3e494da9f25eddc1cae0436c95bd";

  const calculateCID = async (file: File | Buffer): Promise<string> => {
    try {
      let fileBuffer: Uint8Array;
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = new Uint8Array(arrayBuffer);
      } else if (Buffer.isBuffer(file)) {
        fileBuffer = new Uint8Array(file);
      } else {
        throw new TypeError('El archivo debe ser de tipo File o Buffer.');
      }
      const dagPBNode = dagPB.encode({ Data: fileBuffer, Links: [] });
      const hash = await sha256.digest(dagPBNode);
      const cid = CID.create(1, dagPB.code, hash);
  
      return cid.toString(); // Retorna el CID como cadena
    } catch (error) {
      console.error('Error al calcular el CID:', error);
      throw error;
    }
  };


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
      if (image){
        CID = await calculateCID(image);
        console.log(CID, "image CID");
      }

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
          BCS.bcsSerializeStr(memeSymbol), // meme SYMBOL
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
        console.log(tx, "tx tx hash details");    
        fetch("/api/create_meme", {
            method: 'POST', // Usa POST si estás enviando datos
            headers: {
                'Content-Type': 'application/json', // Define el tipo de contenido
            },
            body: JSON.stringify({ memeName, memeSymbol, contractmeme, CID, mainAcc, data_creation, website, twitter, telegram, description, network, uri, tx }), // Envía el objeto `tx` como JSON
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json(); // Analiza la respuesta JSON
        })
        .then((data) => {
            console.log('Respuesta de la API:', data);
            setResult(data); // Actualiza el estado con la respuesta de la API
        })
        .catch((error) => {
            console.error('Error al llamar a la API:', error);
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
