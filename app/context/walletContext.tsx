"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Estructura del contexto
interface WalletContextType {
  walletAddress: string | null;
  provider: any; // Agregar provider aquí
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isConnected: boolean;
  changeNetworkSupra: (chainNumber: number) => Promise<void>;
}

// Crear el contexto
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Función para detectar el proveedor de Starkey
const getProvider = () => {
  if (typeof window !== "undefined" && (window as any).starkey) {
    return (window as any).starkey.supra;
  }
  
  throw new Error("Starkey provider not found. Please install the wallet.");
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<any>(null); // Estado para guardar el provider

  // Conectar la wallet
  const connectWallet = async () => {
    try {
      const prov = getProvider();
      console.log(prov, "provider here")
      const accounts = await prov.connect();
      setWalletAddress(accounts[0]);
      setIsConnected(true);
    } catch (error: any) {
      if (error.code === 4001) {
        console.error("Connection rejected by user.");
      } else {
        console.error("Error connecting to Starkey:", error);
      }
    }
  };

  // Desconectar la wallet
  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      await provider.disconnect();
      setWalletAddress(null);
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting from Starkey:", error);
    }
  };

  const changeNetworkSupra = async (chainNumber: number) => {
    try {
      const provider = getProvider();
      if (typeof chainNumber !== 'number' || isNaN(chainNumber)) {
        throw new Error('Invalid chain number');
      }
      await provider.changeNetwork({ chainId: chainNumber });
    } catch (error) {
      console.error("Error changing network:", error);
    }
  };
 // Escuchar cambios en la cuenta
 useEffect(() => {
  const prov = getProvider();
  setProvider(prov); // Guardamos el provider en el estado

  if (prov && typeof prov.on === 'function') {
    const handleAccountChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        console.log(`Switched to account ${accounts[0]}`);
        setWalletAddress(accounts[0]);
      } else {
        console.log("No accounts connected.");
        setWalletAddress(null);
        setIsConnected(false);
      }
    };

    prov.on("accountChanged", handleAccountChanged);

    return () => {
      prov.removeListener("accountChanged", handleAccountChanged);
    };
  } else {
    console.error("Provider does not support event listeners.");
  }
}, []);

  return (
    <WalletContext.Provider value={{ walletAddress, provider, connectWallet, disconnectWallet, isConnected, changeNetworkSupra }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook para usar el contexto
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet debe ser usado dentro de WalletProvider");
  }
  return context;
};
