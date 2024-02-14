import React, { useState } from "react";
import {  InputSimple, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";

export const DeleteSale = ({urlBase}) => {
  const urlApi = `${urlBase}/api/v1/ventas`;

  const [idSale, setIdSale] = useState(0);

  const [textButton, SetTextButton] = useState('Eliminar')
  const handleID = ({ target: { value } }) => { setIdSale(parseInt(value)), SetTextButton("Eliminar")};
  

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
      SetTextButton("Eliminado")
  };


  return (
    <>
    <TitleForm text='Borrar Una Venta'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="ID" tipo="number" func={handleID}></InputSimple>
    </div>
    <ButtonSave titulo={textButton} func={handleButton}/>
    
    </>
  );
};
