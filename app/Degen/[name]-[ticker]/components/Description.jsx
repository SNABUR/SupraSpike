"use client";

import React, { useState, useContext, useEffect } from 'react';
//import copy_logo from "../../../../images/copy.svg";
//import metamask from "../../../../images/metamask.svg";
//import  DigitalClock, {TradingStatusDot}  from "./TradingTime"
import { usePathname  } from 'next/navigation';
import Image from 'next/image';

const Description = ({ memedata, MemeFee, Tradestarted, ProtectTime, timeframeAddress, setShowMyModalDonate }) => {
  const [showExpanded, setShowExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [nameMeme, setnameMeme] = useState("");
  const [tickerMeme, setTickerMeme] = useState ("");
  //const { add_metamask } = useContext(TransactionContext); 
  const pathname = usePathname();

  useEffect(() => {
    // Obtener la parte final del URL
    const lastSegment = pathname.split('/').filter(Boolean).pop();

    if (lastSegment) {
      // Dividir por el guion
      const [name, ticker] = lastSegment.split('-');
      setnameMeme(name);
      setTickerMeme(ticker);
    }
  }, [pathname]);

  useEffect(() => {
    if (Tradestarted && ProtectTime) {
      const startTime = parseInt(Tradestarted, 10);
      const protectTime = parseInt(ProtectTime, 10);

      if (!isNaN(startTime) && !isNaN(protectTime)) {
        const targetTime = (startTime * 1000) + (protectTime * 60000);

        const timer = setInterval(() => {
          const now = Date.now();
          const difference = targetTime - now;

          if (difference <= 0) {
            clearInterval(timer);
            setTimeLeft(0);
          } else {
            setTimeLeft(difference);
          }
        }, 1000);

        return () => clearInterval(timer);
      } else {
        setTimeLeft(null);
      }
    } else {
      setTimeLeft(null);
    }
  }, [Tradestarted, ProtectTime]);

  const copyContractAddress = (contractAddress) => {
    navigator.clipboard.writeText(contractAddress);
    setClicked(true);
    setTimeout(() => setClicked(false), 200); // Duración del efecto de clic
  };

  const formattedDate = typeof Tradestarted === 'number' && Tradestarted !== null 
  ? new Date(Tradestarted * 1000).toLocaleString() 
  : null;

  // Formatea el tiempo restante
  const formatTime = (ms) => {
    if (ms <= 0) return 'Time is up!';
    
    const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return { months, days, hours, minutes, seconds };
  };
  const timetoend = timeLeft !== null ? formatTime(timeLeft) : null;


  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-1 mt-3 font-role font-bold mb-2 text-white">
      <div className="flex flex-col lg:flex-row lg:justify-between items-center lg:items-center space-y-1 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-fil lg:flex-row justify-around items-around lg:items-center w-full lg:w-auto space-y-2 lg:space-y-0 lg:space-x-4">
          <Image
            className="rounded-3xl w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover border-2 border-gray-700 shadow-lg"
            src={memedata.image || "/no_image.jpg"}
            alt={memedata.name}
            width={128}
            height={128}
          />

          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-1 p-1 sm:p-3 lg:p-5">
            <div className="flex flex-col lg:flex-row lg:space-x-4 items-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                {nameMeme} ({tickerMeme.toUpperCase()})
              </h3>
              <p className="flex flex-fil items-center gap-2 text-sm sm:text-md font-medium text-gray-400 italic">
                {memedata.network}
                <button 
                    //onClick={() => add_metamask(memedata.contract, memedata.image)}
                    className="flex items-center justify-center text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50">
                    <img 
                    //src={metamask}  
                    alt="Metamask" className="justify-center w-4 h-4 md:w-5 md:h-5 "/>
                </button>
                {/*<TradingStatusDot/>*/}
              </p>
            </div>
            {/* Botón Expand para pantallas pequeñas */}
            <div className="lg:hidden">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold text-sm px-4 py-1 rounded-full mt-1 transition-transform transform hover:scale-105"
                onClick={() => setShowExpanded(!showExpanded)}
              >
                {showExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {/* Información adicional */}
            <div className={`${showExpanded ? 'block' : 'hidden'} lg:grid lg:grid-fil-2 w-full`}>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:grid lg:grid-cols-2 w-full`}>
                <div className="flex flex-col items-center md:items-start space-y-1 py-1 px-3 rounded-md bg-gray-800">
                  <div className="flex items-center justify-start">
                    <p className="text-sm sm:text-md font-medium mr-2 text-gray-300">
                      Contract: {memedata?.tokenAddress ? `${memedata.tokenAddress.slice(0, 6)}...${memedata.tokenAddress.slice(-4)}` : 'N/A'}
                    </p>
                    <button
                      onClick={() => copyContractAddress(memedata.tokenAddress)}
                      className={`p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-transform ${clicked ? 'scale-110' : 'hover:scale-105'}`}
                    >
                      <img 
                      //src={copy_logo} 
                      alt="copy_logo" className="w-4 h-4" style={{ filter: 'invert(1)' }} />
                    </button>
                  </div>

                  <div className='text-sm'>
                    {/*<DigitalClock
                      contract={timeframeAddress}
                    />*/}
                  </div>
                </div>

                <div className="flex flex-col space-y-1 py-2 px-3 rounded-md bg-gray-800">
                  <p className="text-sm sm:text-md font-medium text-gray-300">
                    Created: {formattedDate !== null ? formattedDate : 'Server Error...'}
                  </p>

                </div>
              </div>
              <p className="text-gray-300 mt-4 text-sm text-center lg:text-left">
                {memedata.description}
              </p>
            </div>
          </div>

        </div>
        {MemeFee > 0 && (
          <div className="flex bg-gray-900 rounded-xl p-2 ">
          <div className="flex flex-col items-center justify-center w-auto lg:w-auto">
            <div className="hidden sm:flex flex-col items-center bg-black text-white p-4 rounded-lg shadow-lg">
            {timetoend && (
              <>
                <div className="flex flex-fil">
                  {timetoend.months > 0 && (
                      <div className="flex space-x-2 mb-2 text-sm font-mono">
                        <span className="bg-gray-800 p-2 rounded-md">{timetoend.months}</span>
                        <span className="text-xs flex items-center">months</span>
                      </div>
                    )}
                    {timetoend.days > 0 && (
                      <div className="flex space-x-2 mb-2 text-sm font-mono">
                        <span className="bg-gray-800 p-2 rounded-md">{timetoend.days}</span>
                        <span className="text-xs flex items-center">days</span>
                      </div>
                    )}
                </div>

                <div className="flex space-x-2 text-xl font-mono">
                  <div className="flex flex-col items-center">
                    <span className="bg-gray-800 px-4 py-2 rounded-md">{timetoend.hours}</span>
                    <span className="text-xs text-gray-400">hrs</span>
                  </div>
                  <span>:</span>
                  <div className="flex flex-col items-center">
                    <span className="bg-gray-800 px-4 py-2 rounded-md">{timetoend.minutes}</span>
                    <span className="text-xs text-gray-400">min</span>
                  </div>
                  <span>:</span>
                  <div className="flex flex-col items-center">
                    <span className="bg-gray-800 text-center w-12 py-2 rounded-md">{timetoend.seconds}</span>
                    <span className="text-xs text-gray-400">sec</span>
                  </div>
                </div>
              </>
            )}
            </div>
            {timetoend && (
            <div>
              <button
                className={`flex justify-center items-center w-full py-1 md:py-2 px-3 rounded-full mt-1 md:px-6 lg:mt-0 transition-transform transform hover:scale-105 ${
                  !timetoend || timeLeft <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white text-sm md:text-lg font-bold'
                }`}
                onClick={() => setShowMyModalDonate(true)}
                disabled={!timetoend || timeLeft <= 0}
              >
                
                Airdrop
              </button>
            </div>
            )}
          </div>
          {/* Termómetro Visual - Posicionado a la derecha */}
          {MemeFee > 0 && (
            <div className="flex items-start lg:items-center space-x-4 mt-4 lg:mt-0 lg:ml-4 hidden lg:flex">
              <div className="relative h-32 w-3 bg-gray-200 rounded-full overflow-hidden flex flex-col">
                <div
                  className="absolute bottom-0 left-0 w-full bg-green-600 transition-all duration-500 ease-in-out"
                  style={{ height: `${MemeFee / 100}%` }} // Altura basada en el fee
                />
              </div>
              <div className="flex flex-col justify-between h-32 w-8 text-gray-400 text-xs">
                <p className="text-center">100%</p>
                <p className="text-center">75%</p>
                <p className="text-center">50%</p>
                <p className="text-center">25%</p>
                <p className="text-center">0%</p>
              </div>
              <div className="flex flex-col text-white text-sm font-semibold">
                Sell Fee:
                <p>{MemeFee !== null ? `${MemeFee / 100}%` : '...'}</p>
              </div>
            </div>
          )}
          </div>
        )}

      </div>
    </div>

    
  );
};

export default Description;
