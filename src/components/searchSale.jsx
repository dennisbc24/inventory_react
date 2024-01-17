import React, { useState } from "react";
import {  InputSimple} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet } from "./table.jsx";

//const urlBase = 'https://inventario.elwayardo.com'
const urlBase = 'http://localhost:3000'

export const SearchSale = () => {
  
  const [date, setDate] = useState(0);
  const [show, setShow] = useState(false);

  
  const handleDate = ({ target: { value } }) => { setDate(value), setShow(false)};
  

  const handleButton = () => {

    setShow(true)
    
    
  };
  return (
    <>
    <TitleForm text='Buscar Ventas'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple>
    </div>
      <button onClick={handleButton}>Buscar</button>
      
    {<>{ show ? <TableGet url={`http://localhost:3000/api/v1/ventas/salesByDate?date=${date}`}/> : <></>
    }</>}
    </>
  );
};
