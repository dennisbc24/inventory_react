import { useState } from "react";
import {  InputSimple, ButtonSave} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { SalesService } from "../services/sales.js";

const saleService = new SalesService()

export const DeleteSale = ({urlBase}) => {
  const [idSale, setIdSale] = useState(0);
  const [textButton, SetTextButton] = useState('Eliminar')
  const handleID = ({ target: { value } }) => { setIdSale(parseInt(value)), SetTextButton("Eliminar")};
  const handleButton = () => {
  const remove = saleService.delete(urlBase,idSale)
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
