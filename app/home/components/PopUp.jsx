'use client';
import React, { useState, useEffect, useContext, useCallback } from "react";
import  PopUp_2  from "./PopUp_2"
import  FileUpload  from './FileUpload'
import useCreateMemeTransaction from '../../hooks/creatememetx';
import { BCS,TxnBuilderTypes } from "aptos";


const Input2 = ({ placeholder, name_2, type, value, handleChange_2, disabled, className }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="1"
        value={value}
        onChange={(e2) => handleChange_2(e2, name_2)}
        className={className}
        disabled={disabled}
        // Aplicar padding solo al input de tipo 'number'
    />
);

const Textarea = ({ placeholder, name_2, type , value, handleChange_2 }) => (
  <textarea
    placeholder={placeholder}
    type={type}
    value={value}
    onChange={(e2) => handleChange_2(e2, name_2)}
    className="placeholder:italic resize-none p-2 border text-sm rounded focus:outline-none focus:ring focus:border-blue-300 rounded-lg"
    style={{ maxHeight: '200px', minHeight: '150px', minWidth:'200px', maxWidth:'300px'  }}    // Estilos de Tailwind CSS para el textarea
    maxLength={370} // Limita la entrada a 370 caracteres

  />
);

const Tooltip = ({ message, space }) => (
  <div className="relative flex justify-center items-center group z-2">
    {/*<img src={info} alt="info icon" className="w-auto h-3  cursor-pointer" />*/}
    <div
      className={`absolute flex flex-col items-center hidden group-hover:flex`}
      style={{ bottom: `${space || 3}rem` }} 
    >
      <div className="w-36 p-2 text-xs text-white bg-black rounded-md shadow-lg">
        {message}
      </div>
      <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
    </div>
  </div>
);

function PopUp({visible, onClose}) {
    const [showMyModalWallets, setShowMyModalWallets] = useState(false);
    const [file, setFile] = useState(null); // Agregar estado para el archivo
    const [formularioVisible, setFormularioVisible] = useState(false);
    const [formularioVisible2, setFormularioVisible2] = useState(false);
    const [formularioVisible3, setFormularioVisible3] = useState(false);
    const [showMyModal_2, setShowMyModal_2] = useState(false);
    const [showMyModal_3, setShowMyModal_3] = useState(false);
    const [switchState, setSwitchState] = useState("meme"); // Estado para el interruptor
    const [isChecked, setIsChecked] = useState(true);
    const [supplyError, setSupplyError] = useState(''); // Estado para controlar el mensaje de error
    const [description, setDescription] = useState(''); // Estado para el texto del textarea
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
    const [currentAccount, setCurrentAccount] = useState("0x2134werfg"); // Estado para la cuenta actual
    const [provider, setProvider] = useState(null);
    const [Error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";

  const getProvider = useCallback(async () => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window)?.starkey.supra;
      setProvider(starkeyProvider);

      if (starkeyProvider) {
        const currentNetwork = await starkeyProvider.getChainId();
        if (currentNetwork.chainId !== 6) {
          await starkeyProvider.changeNetwork({ chainId: 6 });
          console.log("Network changed to chainId 6");
        }
      }

      return starkeyProvider || null;
    }
    return null;
  }, []);


  useEffect(() => {
    getProvider();
  }, [getProvider]);

    const [FormData_2, setFormData_2] = useState({ MemeName: '', Symbol: '', Supply: '', ProtectInput: '', Timeframe: '', Timezone: '0'});
    const handleChange_2 = (e2, name_2) => {
        setFormData_2((prevState) => ({ ...prevState, [name_2]: e2.target.value }));
    }


        // Estado para el checkbox
        const [isCheckedTimeZone, setIsCheckedTimeZonet] = useState(false);

        // Maneja el cambio de estado del checkbox
        const handleShowTradingTime = () => {
          setIsCheckedTimeZonet(!isCheckedTimeZone);
        };

        // Estado para el checkbox
        const [showFeeInput, setShowFeeInput] = useState(false);

        // Maneja el cambio de estado del checkbox
        const handleShowFee = () => {
            setShowFeeInput(!showFeeInput);
        };


    const maxCharacters = 370;

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };

    const handleOnClose = (event) => {
       // if (event.target.id === 'container_meme') onClose()
    };

      // Actualiza el estado del textarea y verifica la longitud
  const handleTextareaChange = (e2) => {
    const { value } = e2.target;
    if (value.length <= maxCharacters) {
      setDescription(value);
      handleChange_2(e2, 'description'); // Llamada a la función original
    }
  };
    
    //comandos para controlar el pop up 2
    
    const handleOnClose_2 = () => setShowMyModal_2(false);
    const handleOnClose_3 = () => setShowMyModal_3(false);


    const handleOnCloseWallets = () => setShowMyModalWallets(false);


    const toggleFormulario = () => {
        setFormularioVisible(!formularioVisible);
      };

    const toggleFormulario2 = () => {
      setFormularioVisible2(!formularioVisible2);
    };

    const toggleFormulario3 = () => {
      setFormularioVisible3(!formularioVisible3);
    };


    // Aquí actualizas el estado del archivo en PopUp cuando se selecciona un archivo en FileUpload
    const handleFileSelect = (file) => {
      setFile(file); 
    };

    
    const handleSubmit_2 = async () => {
              try {
                if (!provider) {
                  setError("StarKey Wallet is not installed or unsupported.");
                  return;
                }
          
                setIsLoading(true);
                setError(null);
          
                const accounts = await provider.connect();
                const transactionData = await provider.createRawTransactionData([
                  accounts[0],
                  0,
                  CONTRACT_ADDRESS,
                  "pump_fa",
                  "deploy",
                  [],
                  [
                    
                    BCS.bcsSerializeStr("this is a meme"), //meme description
                    BCS.bcsSerializeStr(FormData_2.MemeName), //meme name
                    BCS.bcsSerializeStr(FormData_2.Symbol), //meme SYMBOL
                    BCS.bcsSerializeStr("URI"), //URI JSON
                    BCS.bcsSerializeStr("www.supraaspike.fun"), //WEBSITE
                    BCS.bcsSerializeStr("t.me/xd"), //TELEGRAM
                    BCS.bcsSerializeStr("twitter.com/spike"), //TWITTER
                    
                    
                  ],
                  { txExpiryTime: Math.ceil(Date.now() / 1000) + 30 },
                ]);
          
                const networkData = await provider.getChainId();
                console.log(networkData, "chain id");
          
                const params = {
                  data: transactionData,
                  from: accounts[0],
                  to: CONTRACT_ADDRESS,
                  chainId: 6,
                };
          
                const tx = await provider.sendTransaction(params);
                setResult(tx);
                console.log("Transaction successful:", tx);
              } catch (err) {
                console.error("Error creating memecoin:", err);
                setError(err instanceof Error ? err.message : "Unknown error occurred.");
              } finally {
                setIsLoading(false);
              }
            
          console.log(txhash, "tx hash");
      };
    
    const handleInputChange = (e2, name_2) => {
      const value = e2.target.value;
      handleChange_2(e2, name_2); // Llamada a la función original
  
      // Limpiar el error al escribir en el input de Supply
      if (name_2 === 'Supply') {
          setSupplyError(''); // Limpia el mensaje de error al escribir
      }
  };
  

    if (!visible) return null;

    return (
        <div 
          id="container_meme"
          onClick={handleOnClose} 
          className="fixed z-40 inset-0 bg-black bg-opacity-30 font-role font-bold backdrop-blur-sm flex justify-center items-center">
          <div className="flex relative flex-col justify-center bg-gray-200 rounded-2xl p-2 mt-16 mb-16 md:mt-0 overflow-y-auto">
            <button 
              className="absolute top-2 right-2 p-1 sm:p-2 rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-white border border-zinc-500 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              onClick={onClose}>
                X
            </button>
            
              <div className="flex flex-col p-3 items-center max-h-screen sm:max-h-screen lg:max-h-screen md:max-h-screen">
                {switchState === "meme" ? (
                <div>
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-center">

                      <div className="flex flex-col items-center p-2 ">  {/* Columna 1 */}
                        <div className="flex flex-fil items-center">
                          <p className="font-bold p-2">* Name</p>
                        </div>
                          <Input2 placeholder="" name_2="MemeName" type="text" handleChange_2={handleChange_2} className={`placeholder:italic rounded-xl`}/>
                      </div>
                      <div className="flex flex-col items-center p-2 ">  {/* Columna 2 */}
                        <div className="flex flex-fil items-center">
                          <p className="font-bold p-2">* Symbol</p>
                          </div>  
                          <Input2 placeholder="GG" name_2="Symbol" type="text" handleChange_2={handleChange_2} className={`placeholder:italic uppercase rounded-xl`}/>
                      </div>
                  </div>

                  <div className="flex justify-center font-goldeng">
                    <button className="p-4" onClick={toggleFormulario}>
                      {formularioVisible ? "Less Options" : "More Options"}
                    </button>
                  </div>

           
                  {formularioVisible && (
                  <div className="flex flex-col justify-around items-around">
                    <div className="flex flex-col gap-3 justify-around">
                      {/* Primera columna descripcion*/}
                      <div className="flex flex-col md:flex-fil items-center"> 
                        {Network !== "Solana" && (
                          <div className="flex flex-col md:flex-row gap-3 p-3 max-w-lg w-auto md:justify-center">
                          {/* Card: Transfer Fee */}
                          <div className="bg-white shadow-lg rounded-lg p-4 w-auto md:w-70 mb-4 h-min">
                            <div
                              className="flex items-center justify-between mb-4 cursor-pointer"
                              onClick={handleShowFee}
                            >
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  onChange={handleShowFee}
                                  checked={showFeeInput}
                                  className="h-4 w-4 text-sm cursor-pointer"
                                />
                                <h3 className="font-bold text-sm cursor-pointer">Transfer Fee</h3>
                              </div>
                              <Tooltip 
                                message={
                                  <>
                                    <p className="mb-3">Set a fee between 0 and 1% on each transfer.</p>
                                    <p className="mb-3">Collected fees are sent to the creator's wallet.</p>
                                  </>
                                }
                                space={1}
                              />
                            </div>
                            {showFeeInput && (
                              <div className="flex items-center gap-2">
                                <Input2 
                                  placeholder="0.01" 
                                  name_2="Fee" 
                                  type="number" 
                                  handleChange_2={handleChange_2} 
                                  className="placeholder:italic rounded-lg w-32"
                                />
                                <p>%</p>
                              </div>
                            )}
                          </div>
                          {/* Card: Trading Time Zone */}
                          <div className="bg-white shadow-lg rounded-lg p-4 w-auto md:w-70 mb-4 h-min">
                            <div
                              className="flex items-center justify-between mb-4 cursor-pointer"
                              onClick={handleShowTradingTime}
                            >
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  checked={isCheckedTimeZone} 
                                  onChange={handleShowTradingTime} 
                                  className="h-4 w-4 cursor-pointer"
                                />
                                <h3 className="font-bold text-sm cursor-pointer">Trading Time</h3>
                              </div>
                              <Tooltip
                                message={
                                  <>
                                    <p className="mb-3">Choose a time zone for optimal trading hours.</p>
                                    <p className="mb-3">Major trading times for markets like New York, London, and Tokyo are available.</p>
                                  </>
                                }
                                space={1}
                              />
                            </div>
                            {isCheckedTimeZone && (
                              <select
                                className="p-2 rounded-lg text-sm border w-32"
                                onChange={(e2) => handleChange_2(e2, 'Timezone')}

                              >
                                <option value={0}>All Day</option>
                                <option value={1}>London</option>
                                <option value={2}>New York</option>
                                <option value={3}>Tokyo</option>
                                <option value={4}>Hong-Kong</option>
                              </select>
                            )}
                          </div>
                          {/* Card: Smart Launch */}
                          <div className="bg-white shadow-lg rounded-lg p-4 w-auto md:w-70 mb-4 h-min">
                            <div
                              className="flex items-center justify-between mb-4 cursor-pointer"
                              onClick={handleCheckboxChange}
                            >
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  checked={isChecked} 
                                  onChange={handleCheckboxChange} 
                                  className="h-4 w-4 cursor-pointer"
                                />
                                <h3 className="font-bold text-sm cursor-pointer">Smart Launch</h3>
                              </div>
                              <Tooltip
                                message={
                                  <>
                                    <p className="mb-3">Smart Launch applies a sell fee that starts at 100% and gradually decreases to 0%.</p>
                                    <p className="mb-3">This mechanism helps stabilize the token price over time.</p>
                                  </>
                                }
                                space={1}
                              />
                            </div>
                            {isChecked && (
                              <div className="flex flex-fil items-center gap-2">
                                <Input2 
                                  placeholder="1" 
                                  name_2="ProtectInput" 
                                  type="number" 
                                  handleChange_2={handleChange_2} 
                                  disabled={!isChecked} 
                                  className="placeholder:italic w-16 text-sm rounded-lg"
                                />
                                <select
                                  onChange={(e2) => handleChange_2(e2, 'Timeframe')}
                                  className="border p-2 rounded-lg text-sm w-20"
                                >
                                  <option value={60}>Hours</option>
                                  <option value={60 * 24}>Days</option>
                                  <option value={60 * 24 * 7}>Weeks</option>
                                  <option value={60 * 24 * 30}>Months</option>
                                  <option value={60 * 24 * 30 * 12}>Years</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>                  
                          )}
                      </div>

                      <div className="flex justify-center font-goldeng">
                        <button onClick={toggleFormulario2}>
                          {formularioVisible2 ? "Less Options" : "More Options"}
                        </button>
                      </div>
                      {formularioVisible2 && (
                      <div className="flex flex-col gap-7 flex-1"> {/* Utiliza flex-1 para que esta columna ocupe el espacio restante */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-7">
                          <div className="flex flex-col items-center">
                            <div className="flex flex-fil items-center">
                              <p className="font-bold text-center mb-1 mr-2">Description</p>
                            </div>
                            <div className="flex flex-col justify-center items-center p-2 mb-1 italic input-container">
                              <Textarea
                                  placeholder="we are people who make memes that goes to da moon!!!!"
                                  name_2="description"
                                  type="text"
                                  handleChange_2={handleTextareaChange}
                                  className="resize-none border rounded placeholder:sitalic p-2"
                                  // Ajustamos el estilo para que el textarea tenga el mismo aspecto que el input
                                  style={{ minHeight: 'auto' }}
                                  // Establecemos una altura mínima para el textarea
                              />
                              <p className="flex text-gray-500 text-xs ml-auto mt-1">{description.length}/370</p> {/* Muestra el contador */}
                            </div>
                          </div>

                        <div className="flex flex-col items-center">  
                          <div className="flex flex-col justify-center items-center">
                            <div className="flex flex-fil items-center">
                              <h1 className="text-center font-bold mr-2">Image</h1>
                            </div>
                          </div>
                          <div className="flex justify-center p-2 mb-7">
                            <FileUpload onFileSelect={handleFileSelect}  />
                          </div>
                        </div>
                      </div>
                        <div className="flex justify-center font-goldeng">
                      <button className="py-1" onClick={toggleFormulario3}>
                        {formularioVisible3 ? "Less Options" : "Social Media"}
                      </button>
                    </div>
                      {formularioVisible3 && (
                    <div>
                      <div className="border-t-2 border-dashed border-[#9c9c9c] w-full mt-4"></div>

                      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-center mt-3 gap-3">
                        <div className="flex flex-col">

                          <div className="flex flex-col mb-3">
                            <div className="flex flex-fil items-center justify-center">
                              <p className="flex justify-center font-bold mr-2">Twitter</p>
                            </div>
                              <div className="flex justify-end">
                                  <p className="flex justify-center p-2 italic">twitter.com/</p>
                                  <Input2 placeholder="GeesesGolden" name_2="Twitter" type="text" handleChange_2={handleChange_2} className={`placeholder:italic w-auto p-2 border rounded-lg`}/>
                              </div>
                          </div>
                          <div className="flex flex-col items-center mb-3">
                              <div className="flex flex-fil items-center justify-center">
                                <p className="flex font-bold justify-center mr-2">Web Page</p>
                              </div>
                              <Input2 placeholder="www.yourmeme.com" name_2="Website" type="text" handleChange_2={handleChange_2} className={`placeholder:italic w-64 p-2 border rounded-lg`}/>
                          </div>
                        </div>
                        <div className="flex flex-col">

                          <div className="flex flex-col mb-3">
                            <div className="flex flex-col mb-3">
                              <div className="flex flex-fil items-center justify-center">
                                <p className="flex justify-center font-bold mr-2">Twitch</p>
                                <Tooltip 
                                  message="This channel will appear in the Degen section, allowing you to watch live streams in real time."
                                  space={1}
                                />
                              </div>
                              <div className="flex justify-end">
                                  <p className="flex justify-center p-2 italic">twitch.tv/</p>
                                  <Input2 placeholder="gg" name_2="Twitch" type="text" handleChange_2={handleChange_2} className={`placeholder:italic rounded-lg`}/>
                              </div>
                            </div>
                            <div className="flex flex-fil items-center justify-center">
                              <p className="flex justify-center font-bold mr-2">Discord</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="flex justify-center p-2 italic">discord.com/</p>
                                <Input2 placeholder="invite/FfeHwrqdAY" name_2="Discord" type="text" handleChange_2={handleChange_2} className={`placeholder:italic rounded-lg`}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      )}

                      </div>
                  )}
                    </div>
                    

                  </div>
                    )}


                  {isLoading ? (
                    <div>

                    </div>
                  ) : (
                    <div className="flex justify-center">
                      {currentAccount ? (

                        <div className="flex flex-col p-4 text-xl font-goldeng mt-3">
                          <button
                            className="px-10 py-4 bg-black text-xl text-white rounded-2xl shadow-md hover:bg-[#9e701f] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={() => handleSubmit_2()} // Pasar 'file' como parámetro
                          >
                            Create Meme
                          </button>
                          <div>
                            {isLoading && <p>Esperando confirmación de la transacción...</p>}
                            {/* Resto del contenido del PopUp */}
                          </div>
                        </div>
                        
                      ) : (
                        <div className="bg-amber-400 text-brown-900 rounded-3xl text-xl mt-3 px-7">
                          {/*!address && <LoginButton />*/}
                        </div>
                      )}
                    </div>
                  )}
                  
              </div>
                ) : (
                  <div className="flex flex-col items-center p-2">
                  </div>
                )}
              </div>
              
            </div>
            
          <PopUp_2 onClose_2 = {handleOnClose_2} visible_2 = {showMyModal_2}/>
          {/*<PopUp_3 onClose_3 = {handleOnClose_3} visible_3 = {showMyModal_3}/>*/}
        </div>

    )
}
export default PopUp;
