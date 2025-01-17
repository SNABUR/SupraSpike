"use client";

import React from "react";
import Body from './components/Body';
//import image_Degen from '../../../images/farmegg2.jpeg';


export default function Degen() {


const backgroundStyle = {
    //backgroundImage: `url(${image_Degen })`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 'auto', // Cubre la altura completa de la pantalla
    filter: 'blur(10px)', // Aplica el filtro de desenfoque directamente a la imagen
  };

  return ( 
    <div className="relative min-h-screen overflow-hidden"> {/* Establece la posición relativa */}
      <div style={backgroundStyle} className="absolute inset-0"></div> {/* Capa de fondo con desenfoque */}
      <div className="relative z- bg-black bg-opacity-50"> {/* Capa de contenido con un z-index más alto para estar sobre el fondo */}
        <Body/>

      </div>
    </div>
  );
};
