import React, { useState } from "react";
import { SelectSimple} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet } from "./table.jsx";

//const urlBase = 'https://inventario.elwayardo.com'
const urlBase = 'http://localhost:3000'

export const Inventory = () => {
  
  const [branch, setBranch] = useState(0);
  const [show, setShow] = useState(false);

  
  const handleIdBranch = ({ target: { value } }) => { setBranch(value), setShow(false)};
  

  const handleButton = () => {

    setShow(true)
    
    
  };
  return (
    <>
    <TitleForm text='Inventario por local'></TitleForm>
    <div className="divForm">
    <SelectSimple titulo="Establecimiento"func={handleIdBranch}>
          <option value="1">B17</option>
          <option value="3">Qoripata</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
           {/*  <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple> */}
    </div>
      <button onClick={handleButton}>Buscar</button>
      
    {<>{ show ? <TableGet url={`http://localhost:3000/api/v1/existence/inventary?branch=${branch}`}/> : <></>
    }</>}
    </>
  );
};
