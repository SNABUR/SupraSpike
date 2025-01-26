'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";
import { useWallet } from "./context/walletContext"; // Importa el hook del contexto
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { usePathname } from 'next/navigation'; // Importa usePathname de Next.js
import Wallets from "./wallets"; // Ajusta la ruta al archivo Wallets.js

export default function Bar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [visibleWallets, setVisibleWallets] = useState(false);

  const openWallets = () => setVisibleWallets(true);
  const closeWallets = () => setVisibleWallets(false);

  const { walletAddress, disconnectWallet, changeNetworkSupra } = useWallet(); // Obtén los datos y funciones del contexto
  const [network, setNetwork] = useState('8'); // Estado para la red actual
  const pathname = usePathname(); // Obtén la ruta actual

  const shortAccount = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "";

  const handleToggleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // Evita que el clic se propague
    setToggleMenu((prev) => !prev); // Cambia el estado de toggleMenu
  };

  const handleNetworkChange = (event: any) => {
    const value = event.target.value;
    const chainNumber = parseInt(value, 10);
  
    if (!isNaN(chainNumber)) {
      changeNetworkSupra(chainNumber);
      setNetwork(value);
    } else {
      console.error('Invalid chain number:', value);
    }
  };

  useEffect(() => {
    const closeMenu = (event: any) => {
      if (!event.target.closest(".toggle-menu") && !event.target.closest(".toggle-button")) {
        setToggleMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  // Efecto para cambiar automáticamente entre mainnet y testnet según la ruta
  useEffect(() => {
    if (pathname === '/' || pathname === '/Degen/spike-SPIKE') {
      changeNetworkSupra(6); // Cambia a testnet (6 es el valor de testnet)
      setNetwork('6');
    } else if (pathname === '/NFT' || pathname === '/IDO' || pathname === '/airdrop') {
      changeNetworkSupra(8); // Cambia a mainnet (8 es el valor de mainnet)
      setNetwork('8');
    }
  }, [pathname, changeNetworkSupra]);

  return (
    <div className="flex w-full z-50">
      <header className="relative w-full bg-black font-bold flex md:justify-center justify-between items-center py-4">
        <div className="z-10 flex items-center w-auto max-w-screen-xl mx-auto px-4 z-40">
          <nav className="hidden md:flex text-white list-none text-xl sm:text-lg md:text-2xl lg:text-3xl xl:text-xl sm:gap-6 md:gap-12 xl:gap-16 gap-3 items-center">
            <Link href="/">
              <Image
                src="/supraspike.jpg"
                alt="SPIKE Meme"
                width={37}
                height={37}
                className="rounded-3xl shadow-lg hover:scale-105 transition-transform"
              />
            </Link>
            <Link href="/airdrop" className="nav-link">Airdrop</Link>
            <Link href="/NFT" className="nav-link">NFT</Link>
            <Link href="/IDO" className="nav-link">IDO</Link>
            <Link href="/Degen/spike-SPIKE" className="nav-link">Degen</Link>

            {/* Selector de red */}
            <FormControl sx={{ minWidth: 120, color: 'black' }}>
              <InputLabel id="network-select-label" sx={{ color: 'black' }}>Network</InputLabel>
                <Select
                className="bg-black"
                  labelId="network-select-label"
                  id="network-select"
                  value={network}
                  onChange={handleNetworkChange}
                  label="Network"
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '.MuiSvgIcon-root': {
                      color: 'black',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: 'black', // Fondo oscuro para el menú desplegable
                        color: 'white',
                      },
                    },
                  }}
                >
                <MenuItem sx={{ color: 'white' }} value="8">Mainnet</MenuItem>
                <MenuItem sx={{ color: 'white' }} value="6">Testnet</MenuItem>
              </Select>
            </FormControl>

            {walletAddress ? (
                <div className="relative">
                    {/* Botón de cuenta */}
                    <button
                        onClick={() => setShowDisconnect(!showDisconnect)}
                        className="bg-[#1D2A3A] text-[#F2F5F5] font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-[#353F4A] transition duration-300"
                    >
                        {shortAccount}
                    </button>

                    {/* Menú de desconexión */}
                    {showDisconnect && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#1D2A3A] rounded-lg shadow-lg border border-[#353F4A]">
                            <button
                                onClick={disconnectWallet}
                                className="w-full text-left text-[#F2F5F5] py-2 px-4 hover:bg-[#DD1438] rounded-lg transition duration-300"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={openWallets}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#DD1438] to-[#FF6B6B] text-white font-bold text-lg rounded-lg shadow-xl hover:bg-gradient-to-r hover:from-[#FF6B6B] hover:to-[#DD1438] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                    Connect Wallet
                </button>
            )}
          </nav>

          {/* Versión móvil */}
          <div className="flex md:hidden ml-auto py-2 px-3 w-full justify-between items-center">
            <button onClick={handleToggleClick} className="text-white cursor-pointer">
              {toggleMenu ? <AiOutlineClose fontSize={28} /> : <HiMenuAlt4 fontSize={28} />}
            </button>
          </div>

          {/* Menú móvil */}
          {toggleMenu && (
            <ul className="fixed top-0 right-0 w-[60vw] max-w-xs h-screen shadow-2xl md:hidden flex flex-col justify-start items-center rounded-l-lg bg-black text-white animate-slide-in z-30 p-6 toggle-menu space-y-4">
              <li>
                <AiOutlineClose
                  onClick={() => setToggleMenu(false)}
                  className="text-2xl cursor-pointer hover:text-gray-400 transition duration-200"
                />
              </li>
              <li><Link href="/launchpad">Home</Link></li>
              <li><Link href="/memefactory">Factory</Link></li>
              <li><Link href="/NFT">Hall</Link></li>
              <li><Link href="/IDO">Hall</Link></li>
            </ul>
          )}
        </div>
      </header>
      <Wallets visibleWallets={visibleWallets} onCloseWallets={closeWallets} />

    </div>
  );
}