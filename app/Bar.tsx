'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";
import { useWallet } from "./context/walletContext"; // Importa el hook del contexto
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function Bar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { walletAddress, connectWallet, disconnectWallet, changeNetworkSupra } = useWallet(); // Obtén los datos y funciones del contexto
  const [network, setNetwork] = useState('8');

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

  return (
    <div className="flex w-full z-50">
      <header className="relative w-full bg-black font-bold flex md:justify-center justify-between items-center py-4">
        <div className="z-10 flex items-center w-auto max-w-screen-xl mx-auto px-4 z-40">
          <nav className="hidden md:flex list-none text-xl sm:text-lg md:text-2xl lg:text-3xl xl:text-xl sm:gap-6 md:gap-12 xl:gap-16 gap-3 items-center">
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
            {/*<Link href="/Degen" className="nav-link">Degen</Link>*/}

            <FormControl variant="outlined" className="min-w-120 text-white">
              <InputLabel id="network-select-label">Network</InputLabel>
              <Select
                labelId="network-select-label"
                id="network-select"
                value={network}
                onChange={handleNetworkChange}
                label="Network"
                className="text-white"
              >
                <MenuItem value="8">Mainnet</MenuItem>
                <MenuItem value="6">Testnet</MenuItem>
              </Select>
            </FormControl>

            {walletAddress ? (
              <div
                className="bg-brown-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-brown-600 transition duration-300 w-full md:w-auto justify-center text-center"
                onClick={() => setShowDisconnect(!showDisconnect)}
              >
                {shortAccount}
                {showDisconnect && (
                  <button
                    onClick={disconnectWallet}
                    className="absolute top-50 left-0 bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-yellow-700 text-white font-bold text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 w-full md:w-auto justify-center text-center"
              >
                Connect
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
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}
