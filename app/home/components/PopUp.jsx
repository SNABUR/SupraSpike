'use client';
import React, { useState, useEffect, useContext, useCallback } from "react";
import  PopUp_2  from "./PopUp_2"
import  FileUpload  from './FileUpload'
import useCreateMemeTransaction from "../..//hooks/useCreateMeme";


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
    const { createMeme, error, result } = useCreateMemeTransaction();
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


    const [FormData_2, setFormData_2] = useState({ MemeName: '', Symbol: ''});
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
      if (event.target.id === 'container_meme') onClose()
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

    
    const handleSubmit_2 = async (file) => {
      try {
        await createMeme(FormData_2.MemeName, FormData_2.Symbol, "memeURI"); // Pasa los datos necesarios
        console.log("done tx meme")
      } catch (err) {
        console.error("Error:", err);
      }
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
           
                  {(
                  <div className="flex flex-col justify-around mt-5 items-around">
                    <div className="flex flex-col gap-3 justify-around">
                      <div className="flex justify-center font-goldeng">
                        <button onClick={toggleFormulario2}>
                          {formularioVisible2 ? "Less Options" : "More Options"}
                        </button>
                      </div>
                      {formularioVisible2 && (
                      <div className="flex flex-col gap-3 flex-1"> {/* Utiliza flex-1 para que esta columna ocupe el espacio restante */}
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
                              <p className="flex justify-center font-bold mr-2">Telegram</p>
                            </div>
                              <div className="flex justify-end">
                                  <p className="flex justify-center p-2 italic">t.me/</p>
                                  <Input2 placeholder="Spiker" name_2="Telegram" type="text" handleChange_2={handleChange_2} className={`placeholder:italic w-auto p-2 border rounded-lg`}/>
                              </div>
                          </div>
                          <div className="flex flex-col mb-3">
                            <div className="flex flex-fil items-center justify-center">
                              <p className="flex justify-center font-bold mr-2">Twitter</p>
                            </div>
                              <div className="flex justify-end">
                                  <p className="flex justify-center p-2 italic">twitter.com/</p>
                                  <Input2 placeholder="Spike" name_2="Twitter" type="text" handleChange_2={handleChange_2} className={`placeholder:italic w-auto p-2 border rounded-lg`}/>
                              </div>
                          </div>
                          <div className="flex flex-col items-center mb-3">
                              <div className="flex flex-fil items-center justify-center">
                                <p className="flex font-bold justify-center mr-2">Web Page</p>
                              </div>
                              <Input2 placeholder="www.yourmeme.com" name_2="Website" type="text" handleChange_2={handleChange_2} className={`placeholder:italic w-64 p-2 border rounded-lg`}/>
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
                            onClick={() => handleSubmit_2(file)} // Pasar 'file' como parámetro
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
