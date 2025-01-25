"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Estructura del contexto
interface WalletContextType {
  walletAddress: string | null;
  supraBalance: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isConnected: boolean;
  changeNetworkSupra: (chainNumber: number) => Promise<void>;
  provider: any;
}

// Crear el contexto
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Función para detectar el proveedor de Starkey
const getProvider = () => {
  if (typeof window !== "undefined" && (window as any).starkey?.supra) {
    const provider = (window as any).starkey.supra;
    if (typeof provider.changeNetwork === "function") {
      return provider;
    } else {
      console.error("Supra provider found but does not support 'changeNetwork'.");
    }
  } else {
    console.error("Supra provider not found.");
  }
  return null;
};


export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [supraBalance, setSupraBalance] = useState<any>(null);  
  // Conectar la wallet
  const connectWallet = async () => {
    try {
      const prov = getProvider();
      console.log("Connecting to Starkey...", prov);
      if (!prov) {
        window.open('https://starkey.app/', '_blank'); // Abrir una nueva pestaña con el URL
        return;
      }
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
      setWalletAddress(null);
      setIsConnected(false);
      await provider.disconnect();
    } catch (error) {
      console.error("Error disconnecting from Starkey:", error);
    }
  };


  const changeNetworkSupra = async (chainNumber: number) => {
    console.log("Changing network to", chainNumber);
  
    try {
      if (typeof chainNumber !== 'number' || isNaN(chainNumber) || chainNumber <= 0) {
        throw new Error('Invalid chain number: must be a positive number.');
      }
  
      const provider = getProvider();
      if (!provider) {
        throw new Error('Provider is not initialized.');
      }
  
      if (typeof provider.changeNetwork !== 'function') {
        throw new Error('Provider does not support changeNetwork.');
      }
  
      await provider.changeNetwork({ chainId: chainNumber });
      console.log(`Network changed to chain ID: ${chainNumber}`);
    } catch (error:any) {
      console.log("Error changing network:", error.message);
      console.debug("Full error details:", error);
    }
  };
  

  // Escuchar cambios en la cuenta
  useEffect(() => {
    const prov = getProvider();
  
    if (!prov) {
      console.error("Provider not found.");
      return;
    }
  
    const initializeProvider = async () => {
      try {
        // Validar el proveedor antes de llamar al método
        if (typeof prov.changeNetwork !== "function") {
          throw new Error("changeNetwork is not supported by the provider.");
        }
  
        setProvider(prov);
  
        // Configurar los listeners
        if (typeof prov.on === "function") {
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
          console.log("Provider does not support event listeners.");
        }
      } catch (error:any) {
        console.log("Error initializing provider:", error.message);
        console.debug("Full error details:", error);
      }
    };
  
    initializeProvider();
  }, [walletAddress]);

  // Obtener el balance de la cuenta
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await provider.balance();
        setSupraBalance(balance.formattedBalance); // Usa el balance formateado para mostrar al usuario
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };
  
    if (walletAddress && provider) {
      fetchBalance();
    }
  }, [walletAddress, provider]); // Incluye provider en las dependencias
  
  return (
    <WalletContext.Provider value={{ walletAddress, supraBalance, provider, connectWallet, disconnectWallet, isConnected, changeNetworkSupra }}>
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