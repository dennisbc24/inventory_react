import React, { useState } from "react";
import {  InputSimple} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";

export const DeleteSale = ({urlBase}) => {
  const urlApi = `${urlBase}/api/v1/ventas`;

  const [idSale, setIdSale] = useState(0);
  const [show, setShow] = useState(false);

  
  const handleID = ({ target: { value } }) => { setIdSale(value)};
  

  const handleButton = () => {

    
    const deleteNow = async () => {
        try {
            const urlWithQuery =`${urlApi}?id=${idSale}`
          const deleteSale = await axios.delete(urlWithQuery)
  
          console.log('borrado');
          
        } catch (error) {
          console.error("Error al borrar:", error);
        }
      };
      deleteNow()  
  };


  return (
    <>
    <TitleForm text='Borrar Una Venta'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="ID" tipo="number" func={handleID}></InputSimple>
    </div>
      <button onClick={handleButton}>Eliminar</button>
    </>
  );
};
