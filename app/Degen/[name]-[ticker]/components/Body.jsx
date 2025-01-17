"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
//import UniTradingViewChart from './unitvwidget'; // Importa tu primer gráfico
//import GGTradingViewChart from './ggtvwidget'; // Importa tu primer gráfico
import Searcher  from './Searcher';
//import { Burn } from './';
//import { Comments } from './';
import  Description  from "./Description";
//import { useParams } from "react-router-dom";
//import TransportMethod from './switch';
//import useTokenBalance  from '../../../context/Hooks/GetBalance';
//import LoginButton from '../../LoginButton';
import { useWallet } from '../../../context/walletContext';
import useBuyMeme from "@/app/hooks/BuyMeme";
import useSellMeme from "@/app/hooks/SellMeme";
import { usePathname  } from 'next/navigation';


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
  const { walletAddress } = useWallet(); // Obtén el provider desde el contexto
  const { BuyMeme, isLoading, error, result } = useBuyMeme(); // Obtén la función de compra desde el contexto
  const { SellMeme, isLoading: sellisLoading, error: errorisLoading, result: resultisLoading } = useSellMeme(); // Obtén la función de venta desde el contexto
  const [activeTab, setActiveTab] = useState("buy");
  const [buyPercentage, setBuyPercentage] = useState(0); // Nuevo estado para porcentaje de compra
  const [sellPercentage, setSellPercentage] = useState(0); // Nuevo estado para porcentaje de venta
  const [percentage, setPercentage] = useState(0);
  const [customPercentages, setCustomPercentages] = useState([1, 2, 3, 5]);
  const [isEditing, setIsEditing] = useState(false);
  const [memedata, setMemeData] = useState({});
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");

  
  useEffect(() => {

    const call_data = async() => {
    //const search = name+"-"+ticker
    //const response = await fetch(`/api/db_memes?search=${encodeURIComponent(search)}`);
    }

  call_data()
  }, [name, ticker])

  useEffect(() => {
    // Obtener la parte final del URL
    const lastSegment = pathname.split('/').filter(Boolean).pop();

    if (lastSegment) {
      // Dividir por el guion
      const [name, ticker] = lastSegment.split('-');
      setName(name);
      setTicker(ticker);
    }
  }, [pathname]);

  //const { BuyMeme, SellMeme, FormData_6, handleChange_6,  switchPool, setSwitchPool, change_input_swap } = useContext(TransactionContextETH); 
  //const { currentAccount, treasuryContract, BuyMemeBase, walletext, currentbalance} = useContext(TransactionContext); 
  const [showMyModalDonate, setShowMyModalDonate] = useState(false);
  const [showMyModalBurn, setShowMyModalBurn] = useState(false);
  const [ProtectTime, setProtectTime] = useState(null);
  const [Tradestarted, setTradestarted] = useState(null);
        // Extraer el 'id' de la URL que contiene tanto el contract como el network
  //const { id } = useParams();
  const prevIdRef = useRef();
  const handleOnCloseDonate = () => setShowMyModalDonate(false);
  const handleOnCloseBurn = () => setShowMyModalBurn(false);
  const [dataComments, setDataComments] = useState([]);
  const [Tablename, setTableName] = useState("");
  const [ChainNet,setChainNet] = useState("");
  const [MemeFee, setMemeFee] = useState(null);
  const [UniContract, setUniContract] = useState("0xc50f259ed3d08ea60a15e886bebd7bdaf81501f5");
  const [GGContract, setGGContract] = useState("0xc50f259ed3d08ea60a15e886bebd7bdaf81501f5");
  //const { balance: MemeBalance} = useTokenBalance(id.split('-')[1], currentAccount, 18);
  //const { balance: MemeTreasury} = useTokenBalance(id.split('-')[1], treasuryContract, 18);
  const [showComments, setShowComments] = useState(false);
  const [timeframeAddress, setTimeframeAddress] = useState(null);

  //const { address } = useAccount();


  const [FormData_6, setFormData_6] = useState({ amountswap: ''});
  const handleChange_6 = (e2, name_6) => {
    setFormData_6((prevState) => ({ ...prevState, [name_6]: e2.target.value }));
  }

  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await AppSocialPoint.get('/comments', {
        //const response = await Axios.get('https://app-social-gg.onrender.com/comments', {

          params: { tableName: Tablename, chainNet: ChainNet },
        });

        const fetchedComments = response.data.map(comment => ({
          ...comment,
          date: comment.date,  // No se realiza la conversión aquí
        }));

        setDataComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (Tablename && ChainNet) {
      fetchComments();
    }
  }, [Tablename, ChainNet]); // Dependencias específicas para comentarios

  {/*useEffect(() => {
    if (prevIdRef.current !== id) {
      const allMemeData = async () => {
        const [searchNetwork, searchContract] = id.split('-');
        const lowerCaseContract = searchContract.toLowerCase(); 

        try {
          const response = await dbMemesPoint.get('/meme_by_contract', {
            params: {
              contract: lowerCaseContract,
              network: searchNetwork,
            }
          });
          setMemeData(response.data);
        } catch (error) {
          console.error('Error fetching meme data:', error);
        }

        try {
          const checkpool = await AppDataPoint.get('/meme_pool', {
            params: {
              contract: searchContract,
              network: searchNetwork,
              AMM: "UNI",
            }
          });
          setUniContract(checkpool.data.pairAddress);
        } catch (error) {
          console.error('Error fetching pool data:', error);
        }
        try {
          const checkpoolUNI = await AppDataPoint.get('/meme_pool', {
            params: {
              contract: searchContract,
              network: searchNetwork,
              AMM: "GG",
            }
          });
          setGGContract(checkpoolUNI.data.pairAddress);
        } catch (error) {
          console.error('Error fetching pool data:', error);
        }
      };

      allMemeData();
      prevIdRef.current = id; // Actualiza el ref con el nuevo id
    }
  }, []); // Dependencia específica para meme data */}
  

  /*useEffect(() => {
    const fetchMemeFee = async () => {
  
      // Reset states to avoid retaining old values
      setMemeFee(null);
      setProtectTime(null);
      setTradestarted(false);
      setTimeframeAddress(null);
  
      if (memedata) {
        try {
          const [searchNetwork, searchContract] = id.split('-');
  
          const memefeesdata = await AppDataPoint.get('/meme_data', {
            params: {
              contract_meme: searchContract,
              network: searchNetwork,
            }
          });
  
          setMemeFee(memefeesdata.data.memefeestring);
          setProtectTime(memefeesdata.data.protectminutes);
          setTradestarted(memefeesdata.data.startTrade);
          setTimeframeAddress(memefeesdata.data.timeframeAddress);
        } catch (error) {
          console.error("Error fetching Meme Fee:", error);
        }
      }
    };
  
    fetchMemeFee();
  }, [memedata]);*/
  

  // Función para cambiar entre pestañas
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reiniciar el valor del input cuando se cambia de pestaña
    //change_input_swap(0);
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsEditing(false);
    }
  };

  const handleBuy = (contract) => {
    if (walletext==="Base Wallet") {
      BuyMemeBase(contract, FormData_6.amountswap); 
    } else{
      BuyMeme(contract); 
    }
  }

  const handleSell = (contract) => {

      SellMeme(contract); 
  }

  const handleClickpPercent = (value) => {
    if (activeTab === "buy") {
      setBuyPercentage(value);
      const ethValueForBuy = ((currentbalance.data?.formatted ? parseFloat(currentbalance.data.formatted) : 0) * value / 100).toFixed(5);
      change_input_swap(ethValueForBuy);
      
    } else if (activeTab === "sell") {
      setSellPercentage(value);
      //const ethValueForSell = (MemeBalance * value) / 100;
      //change_input_swap(ethValueForSell);
    }
  };
  

  const handleEditPercentage = (index, newValue) => {
    const newPercentages = [...customPercentages];
    newPercentages[index] = newValue;
    setCustomPercentages(newPercentages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r rounded-3xl font-role font-bold from-gray-800 via-black to-gray-900 px-3 py-1 max-w-7xl mx-auto">
      {/* Barra de búsqueda y título */}
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

      {/* Contenedor principal */}

      <div className="flex flex-col lg:flex-row gap-2">
        {/* Sección del gráfico */}
        <div className="w-full bg-gray-800 rounded-lg shadow-lg p-3 lg:col-span-3">
          <div className="relative ">
            <div className="absolute top-1 right-2 z-20"> {/* Cambié left-1 a right-4 para moverlo a la derecha */}
              {/*<TransportMethod switchPool={switchPool} setSwitchPool={setSwitchPool}/>*/}
            </div>
          </div>
          {/*<div className="w-auto h-96 bg-gray-700 rounded-lg flex items-center justify-center">
            

            {switchPool === 0 ? (


              <GGTradingViewChart 
              poolContract={GGContract? GGContract : ''}
              chainNet={memedata?.network ? memedata.network : ''}
              SetOpenDonate={setShowMyModalDonate}
            />

            ) : (
                <UniTradingViewChart
                poolContract={UniContract? UniContract : ''}
                chainNet={memedata?.network ? memedata.network : ''}
                SetOpenDonate={setShowMyModalDonate}
              />
            )}
          </div>*/}
        </div>

        {/* Sección de compra y venta */}
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
                    {/*<p className="text-md lg:text-lg font-semibold text-gray-100">
                      {currentbalance.data?.formatted ? parseFloat(currentbalance.data.formatted).toFixed(5) : '0.00000'}
                    </p>*/}
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
                    <div className="text-gray-200 lg:text-lg">ETH</div>
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
                      onClick={() => BuyMeme(name, ticker, FormData_6.amountswap)}
                      //onClick={() => handleBuy(id.split('-')[1])}
                      className="w-full py-2 lg:py-3 rounded-md shadow-md bg-green-500 hover:bg-green-600 transition duration-200"
                    >
                      Buy
                    </button>
                  ) : (
                    <div className="bg-amber-400 text-brown-900 rounded-xl">
                      {/*!address && <LoginButton />*/}
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
                    {/*<p className="text-md lg:text-lg font-semibold text-gray-100">{parseFloat(MemeBalance).toFixed(5)}</p>*/}
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
                    <div className="text-gray-200 lg:text-lg">{memedata.ticker}</div>
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
                      onClick={() => SellMeme(name, ticker, FormData_6.amountswap)}
                      //onClick={() => handleSell(id.split('-')[1])}
                      className="w-full py-2 lg:py-3 rounded-md shadow-md bg-red-500 hover:bg-red-600 transition duration-200"
                    >
                      Sell
                    </button>
                  ) : (
                    <div className="bg-amber-400 text-brown-900 rounded-xl">
                      {/*!address && <LoginButton />*/}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal para editar los porcentajes */}
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

      {/* Sección de comentarios */}
      <div className="flex flex-col lg:flex-row justify-between mt-2 md:mt-3 lg:space-x-3 w-full">
          {/* Sección de Twitch */}
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
      {/* Sección de comentarios */}
        <div className="flex flex-col w-full items-center justify-center lg:w-full">
            {/* Botón para mostrar/ocultar los comentarios en pantallas pequeñas */}
            <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center sm:block md:hidden italic text-white rounded-md px-4 py-2">
                {/* Condición para mostrar el texto con la flecha */}
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

            {/* Sección de comentarios, visible solo si `showComments` es true */}
            <div className={`mt-4 w-full ${showComments ? 'block' : 'hidden'} md:block`}>
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Comments (beta)</h3>
                  <button 
                      onClick={() => setShowMyModalBurn(true)}
                      className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                      Burn
                  </button>
              </div>
                {/*<Comments
                    contractMeme={memedata?.contract ? memedata.contract.substring(1) : ''} 
                    chainNetwork={memedata?.network ? memedata.network : ''} 
                    Comments={dataComments || []} 
                />*/}
            </div>
        </div>
          {/* Sección de holders */}
          <div className={`flex-none {sm:block ${showComments ? 'block' : 'hidden'} mt-4 text-white md:block lg:w-1/4 bg-gray-800 rounded-lg shadow-lg p-4 mt-4 lg:mt-0`}>
            <h3 className="text-xl font-semibold mb-2">🏆 Holders</h3>
            {/* Aquí puedes añadir la lógica y el componente para los holders */}
          </div>

      </div>


      {/*<Donate onCloseWallets={handleOnCloseDonate} visibleWallets={showMyModalDonate} memedata={memedata} TreasuryBalance={MemeTreasury}/>*/}
      {/*<Burn onCloseWallets={handleOnCloseBurn} visibleWallets={showMyModalBurn} memecontract={memedata.contract} memeticker={memedata.ticker}/>*/}


    </div>
  );
};

export default Body;
