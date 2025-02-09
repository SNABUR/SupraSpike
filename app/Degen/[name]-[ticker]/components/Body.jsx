"use client";

import React, { useState, useEffect, useRef } from "react";
import TradingViewChart from './tvwidget';
import Searcher  from './Searcher';
import  Description  from "./Description";
import { useWallet } from '@/app/context/walletContext';
import useViewFunction from "@/app/hooks/view/viewPump";
import useViewCoin from "@/app/hooks/view/viewCoin";
import useBuyMeme from "@/app/hooks/BuyMeme";
import useSellMeme from "@/app/hooks/SellMeme";
import useMigratePool from "@/app/hooks/MigrateDEX";
import { usePathname } from 'next/navigation';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Wallets from "@/app/wallets";

const MySwal = withReactContent(Swal);


const Input = ({ placeholder, name_6, type, value, handleChange_6 }) => (
  <input
      placeholder={placeholder}
      type={type}
      step="1"
      value={value}
      onChange={(e6) => handleChange_6(e6, name_6)}
      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

  />
);  

const Body = () => {
  const { walletAddress, supraBalance } = useWallet();
  const { BuyMeme, isLoading, error, result } = useBuyMeme(); 
  const { resultView: resultmigrate, loadingView: resultloadmigrate, errorView: errorloadmigrate,   callViewFunction: callViewFunctionMigrate } = useViewFunction(); 
  const { resultView, loadingView, errorView, callViewFunction } = useViewFunction(); 
  const { result: resultigrateDEX, isLoading: resulTmigrateDEX, errorresultmigrateDEX, MigratePool } = useMigratePool(); 
  const { resultCoin, callViewCoin } = useViewCoin(); 
  const { SellMeme, isLoading: sellisLoading, error: errorsell, result: resultsell} = useSellMeme(); 
  const [activeTab, setActiveTab] = useState("buy");
  const [buyPercentage, setBuyPercentage] = useState(0); 
  const [sellPercentage, setSellPercentage] = useState(0); 
  const [percentage, setPercentage] = useState(0);
  const [customPercentages, setCustomPercentages] = useState([1, 2, 3, 5]);
  const [isEditing, setIsEditing] = useState(false);
  const [memedata, setMemeData] = useState({});
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [visibleWallets, setVisibleWallets] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [tokenBalance,setTokenBalance] = useState("0.00");

  useEffect(() => {
    if (memedata?.tokenAddress) {
      setTokenAddress(memedata.tokenAddress);
    }
  }, [memedata]);

  useEffect(() => {
    if (resultCoin?.result?.[0]) {
      const formattedBalance = (Number(resultCoin.result[0]) / Math.pow(10, 8)).toFixed(2);
      setTokenBalance(formattedBalance);
    } else {
      setTokenBalance("0.00");
    }
  }, [resultCoin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(name, symbol, "name and symbol");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get_meme?name=${encodeURIComponent(name)}&symbol=${encodeURIComponent(symbol)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMemeData(data);
      } catch (error) {
        console.error('Error fetching meme data:', error);
      }
    };
  
    if (name && symbol) {
      fetchData();
    }
  }, [name, symbol]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tokenAddress) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grapher`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tokenAddress,
            limit: 100, 
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data,"data before graphdata")
        setGraphData(data); 
      } catch (error) {
        console.error('Error fetching OHLC data:', error);
      }
    };

    fetchData();
  }, [tokenAddress]);

  useEffect(() => {
    if (result) {
      MySwal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Transaction Successful',
        html: `<a href="https://testnet.suprascan.io/tx/${result}" target="_blank" style="color: #ffffff;">Transaction Hash: ${result}</a>`,
        showConfirmButton: false,
        timer: 13700,
        toast: true,
        background: '#000000', 
        iconColor: '#28a745',
        customClass: {
          popup: 'border border-green-500',
        },
      });
    }
  }, [result]);

  useEffect(() => {
    if (resultsell) {
      MySwal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Transaction Successful',
        html: `<a href="https://testnet.suprascan.io/tx/${resultsell}" target="_blank" style="color: #ffffff;">Transaction Hash: ${resultsell}</a>`,
        showConfirmButton: false,
        timer: 13700,
        toast: true,
        background: '#000000',
        iconColor: '#FF0000',
        customClass: {
          popup: 'border border-red-500', 
        },
      });
    }
  }, [resultsell]);

  
  useEffect(() => {
    if (!name || !symbol || !walletAddress) {
      console.warn("Name or symbol is missing. Skipping call to callViewFunction.");
      return;
    }
  
    callViewFunctionMigrate('get_pump_stage', [name, symbol]).catch((err) => {
      console.error("Error calling view function:", err);
    });
    callViewFunction('get_pool_state', [name, symbol]).catch((err) => {
      console.error("Error calling view function:", err);
    });

    callViewCoin('get_balance', [walletAddress, name, symbol]).catch((err) => {
      console.error("Error calling view function:", err);
    });

  }, [name, symbol, walletAddress, callViewFunction]);
  

  useEffect(() => {
    const lastSegment = pathname.split('/').filter(Boolean).pop();

    if (lastSegment) {
      const [name, symbol] = lastSegment.split('-');
      setName(name);
      setSymbol(symbol);
    }
  }, [pathname]);

  const [showMyModalDonate, setShowMyModalDonate] = useState(false);
  const [ProtectTime, setProtectTime] = useState(null);
  const [Tradestarted, setTradestarted] = useState(null);
  const prevIdRef = useRef();
  const [dataComments, setDataComments] = useState([]);
  const [Tablename, setTableName] = useState("");
  const [ChainNet,setChainNet] = useState("");
  const [MemeFee, setMemeFee] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [timeframeAddress, setTimeframeAddress] = useState(null);
  const [FormData_6, setFormData_6] = useState({ amountswap: ''});

  const handleChange_6 = (e2, name_6) => {
    setFormData_6((prevState) => ({ ...prevState, [name_6]: e2.target.value }));
  }

  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await AppSocialPoint.get('/comments', {

          params: { tableName: Tablename, chainNet: ChainNet },
        });

        const fetchedComments = response.data.map(comment => ({
          ...comment,
          date: comment.date, 
        }));

        setDataComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (Tablename && ChainNet) {
      fetchComments();
    }
  }, [Tablename, ChainNet]); 

  const openWallets = () => setVisibleWallets(true);
  const closeWallets = () => setVisibleWallets(false);

  const change_input_swap = (percent) => {
    try {
        if (percent === null) {
            throw new Error("El valor de percent no puede ser null");
        }
        
        setFormData_6((prevFormData) => ({
            ...prevFormData,
            amountswap: percent.toString()
        }));
    } catch (error) {
        console.error("Error al cambiar el input de staking:", error);
    }
};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    change_input_swap(0);
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsEditing(false);
    }
  };

  const handleClickpPercent = (value) => {
    if (activeTab === "buy") {
      setBuyPercentage(value);
      const ethValueForBuy = ((supraBalance ? parseFloat(supraBalance) : 0) * value / 100).toFixed(3);
      change_input_swap(ethValueForBuy);
      
    } else if (activeTab === "sell") {
      setSellPercentage(value);
      const ethValueForSell = ((tokenBalance * value) / 100).toFixed(1).replace(/\.0$/, "");
      change_input_swap(ethValueForSell);
    }
  };
  

  const handleEditPercentage = (index, newValue) => {
    const newPercentages = [...customPercentages];
    newPercentages[index] = newValue;
    setCustomPercentages(newPercentages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r rounded-3xl font-role font-bold from-gray-800 via-black to-gray-900 px-3 py-1 max-w-7xl mx-auto">
      <div className="mb-4 items-center justify-center">
      </div>

      <Searcher
        setMemeData={setMemeData} 
        setTableName={setTableName}
        setChainNet ={setChainNet}
      />
      {<Description
        memedata={memedata}
        MemeFee={MemeFee}
        Tradestarted={Tradestarted}
        ProtectTime={ProtectTime}
        timeframeAddress={timeframeAddress}
        setShowMyModalDonate={setShowMyModalDonate}
      />}

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="w-full bg-gray-800 rounded-lg shadow-lg p-3 lg:col-span-3">
          <div className="relative ">
            <div className="absolute top-1 right-2 z-20"> 
            </div>
          </div>
          <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center p-2 md:p-4">
            <TradingViewChart 
              tokenAddress={tokenAddress} 
              graphData={graphData}
            />
          </div>

        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-3 lg:col-span-1">
          <div className="flex flex-fil sm:flex-row sm:justify-around mb-3 gap-3 sm:space-y-0">
            <button
              className={`w-full text-sm sm:w-auto lg:w-full px-3 sm:px-7 py-2 sm:py-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none ${
                activeTab === "buy" ? "bg-blue-800 text-white" : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => handleTabChange('buy')}
            >
              Buy
            </button>
            <button
              className={`w-full text-sm sm:w-auto lg:w-full px-3 sm:px-7 py-2 sm:py-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none ${
                activeTab === "sell" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => handleTabChange("sell")}
            >
              Sell
            </button>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg lg:p-5 shadow-lg">
            {activeTab === "buy" && (
              <div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-md lg:text-lg font-semibold text-gray-200">Balance:</label>
                    <p className="text-md lg:text-lg font-semibold text-gray-100">{supraBalance ? Number(supraBalance).toFixed(2) : "0.00"}</p>
                  </div>

                  <div className="flex items-center space-x-2 text-white mb-3">
                    <Input 
                      placeholder="1"
                      name_6="amountswap"
                      type="number"
                      value={FormData_6.amountswap}
                      handleChange_6={handleChange_6}
                      className="flex-1 py-2 px-3 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400"
                    />
                    <div className="text-gray-200 lg:text-lg">SUPRA</div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={buyPercentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full h-8 cursor-pointer bg-gray-600 accent-blue-500"
                  />
                  <div className="flex space-x-2 mb-2">
                    {customPercentages.map((value, index) => (
                      <button
                        key={`percentage-${index}`}
                        className="flex-1 px-3 py-1 lg:py-2 rounded-md bg-gray-900 text-gray-200 hover:bg-blue-600 transition duration-200"
                        onClick={() => handleClickpPercent(value)}
                      >
                        {value}%
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 rounded-md bg-gray-900 text-gray-200 hover:bg-blue-600 transition duration-200"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                {<div className="flex justify-center mt-4">
                  {walletAddress ? (
                    <button
                      onClick={() => BuyMeme(name, symbol, FormData_6.amountswap)}
                      className="w-full py-2 lg:py-3 rounded-md shadow-md bg-green-500 hover:bg-green-600 transition duration-200"
                    >
                      Buy
                    </button>
                  ) : (
                  <div className="bg-amber-400 text-brown-900 rounded-xl">
                    
                    <button
                      onClick={openWallets}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                      >
                      Connect Wallet
                    </button>
                  </div>

                  )}
                </div>}
                
              </div>
            )}

            {activeTab === "sell" && (
              <div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-md lg:text-lg font-semibold text-gray-200">Balance:</label>
                      <p className="text-md lg:text-lg font-semibold text-gray-100">{tokenBalance}</p>
                  </div>

                  <div className="flex items-center space-x-2  text-white mb-3">
                    <Input 
                      placeholder="1"
                      name_6="amountswap"
                      type="number"
                      value={FormData_6.amountswap}
                      handleChange_6={handleChange_6}
                      className="flex-1 py-2 px-3 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-red-400 focus:border-red-400"
                    />
                    <div className="text-gray-200 lg:text-lg">{symbol}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sellPercentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full h-8 cursor-pointer bg-gray-600 accent-red-500"
                  />
                  <div className="flex space-x-2 mb-2">
                    {customPercentages.map((value, index) => (
                      <button
                        key={index}
                        className="flex-1 px-3 py-1 lg:py-2 rounded-md bg-gray-900 text-gray-200 hover:bg-red-600 transition duration-200"
                        onClick={() => handleClickpPercent(value)}
                      >
                        {value}%
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 rounded-md bg-gray-900 text-gray-200 hover:bg-red-600 transition duration-200"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  {walletAddress ? (
                    <button
                      onClick={() => SellMeme(name, symbol, FormData_6.amountswap)}
                      className="w-full py-2 lg:py-3 rounded-md shadow-md bg-red-500 hover:bg-red-600 transition duration-200"
                    >
                      Sell
                    </button>
                  ) : (
                    <div className="bg-amber-400 text-brown-900 rounded-xl">
                      <button
                        onClick={openWallets}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                        >
                        Connect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4 mt-7">
            {Array.isArray(resultmigrate?.result) && resultmigrate?.result[0] === 1 ? (
              <div>
                <label
                  htmlFor="bonding-curve-progress"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Bonding Curve Progress
                </label>
                <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden relative">
                  <div
                    className="bg-blue-500 h-4 transition-all duration-300 ease-in-out"
                    style={{
                      width: `${
                        (resultView?.result[1] / (1370 * Math.pow(10, 8))) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400 mt-1 block">
                  {((resultView?.result[1] / (1370 * Math.pow(10, 8))) * 100).toFixed(2)}%
                </span>
              </div>
            ) : Array.isArray(resultmigrate?.result) && resultmigrate?.result[0] !== 1 ? (
              <div className="flex justify-center">
                <button
                  onClick={() => MigratePool(name, symbol)} 
                  className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out"
                >
                  <span className="absolute inset-0 w-full h-full bg-white opacity-10 rounded-xl blur-md"></span>
                  <span className="relative">Migrate to DEX</span>
                </button>
              </div>
            ) : (
              null
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white z-10" onClick={handleOutsideClick}>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Edit Percentages</h3>
            <div className="space-y-2">
              {customPercentages.map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleEditPercentage(index, parseFloat(e.target.value))}
                    className="flex-1 rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white rounded-md px-4 py-2 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between mt-2 md:mt-3 lg:space-x-3 w-full">
          {memedata.twitch && (
            <div className="flex-none hidden lg:w-1/4 bg-gray-800 rounded-lg shadow-lg p-4 mt-4 lg:mt-0">
              <h3 className="text-xl font-semibold mb-2">🎥 TWITCH (No Oficial)</h3>
              <div className="flex justify-center">
                <iframe
                  src={`https://player.twitch.tv/?channel=${memedata.twitch.split('/').pop()}&parent=goldengcoin.github.io`}
                  height="300"
                  width="100%"
                  frameBorder="0"
                  allowFullScreen={true}
                  scrolling="no"
                  className="rounded-md"
                ></iframe>
              </div>
            </div>
          )}
        <div className="flex flex-col w-full items-center justify-center lg:w-full">
            <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center sm:block md:hidden italic text-white rounded-md px-4 py-2">
                {showComments ? (
                    <>
                        <span className="mr-2">{'↑'}</span>
                        Hide Comments
                    </>
                ) : (
                    <>
                        <span className="mr-2">{'↓'}</span>
                        Show Comments
                    </>
                )}
            </button>
        </div>
      </div>

    <Wallets visibleWallets={visibleWallets} onCloseWallets={closeWallets} />

    </div>
  );
};

export default Body;
