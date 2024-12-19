"use client";

import React, { useState } from "react";
import { Keypair } from "@solana/web3.js";
import CryptoJS from "crypto-js";

export default function Generator() {
  const [inputText, setInputText] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  // Función para generar claves
  const generateKeys = () => {
    if (!inputText) return alert("Por favor ingresa un texto.");

    try {
      // Generar hash SHA-256
      const hash = CryptoJS.SHA256(inputText).toString();

      // Extraer los primeros 32 bytes
      const seed = Uint8Array.from(Buffer.from(hash, "hex").slice(0, 32));

      // Crear un Keypair desde el seed
      const keypair = Keypair.fromSeed(seed);

      setPrivateKey(`[${keypair.secretKey.join(", ")}]`);
      setPublicKey(keypair.publicKey.toBase58());
    } catch (error) {
      console.error("Error generando las claves:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Generador de Claves Privadas - Solana
        </h2>
        <input
          type="text"
          placeholder="Escribe letras o una frase..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <button
          onClick={generateKeys}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          Generar Claves
        </button>
        {privateKey && (
          <div className="mt-6">
            <p className="text-gray-700 break-words">
              <strong className="text-gray-900">Clave Pública:</strong>{" "}
              {publicKey}
            </p>
            <p className="text-gray-700 break-words mt-2">
              <strong className="text-gray-900">Clave Privada:</strong>{" "}
              {privateKey}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
