import React, { useState } from "react";
import { SelectSimple, ButtonSave} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet, TableGet2 } from "./table.jsx";
import {InventoryService} from "../services/inventory.js"
const service = new InventoryService()
export const Inventory = ({urlBase}) => {
  
  const [branch, setBranch] = useState(1);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [datos, setDatos] = useState();

     
  const handleIdBranch = ({ target: { value } }) => { setBranch(parseInt(value)), setShow(false)};
  const handleButton = () => {setShow(true)}

const handleTest = async () =>{
const check =  await service.CompareInventories({store:1,deposit:4, urlBase})
const res1 = check.siCoincidentes
const res2 = check.productosNoCoincidentes
const rest3 = res1.concat(res2)
setDatos(rest3.sort((a,b)=>{
  return a.nombre.localeCompare(b.nombre, 'en')
}))
setShow2(true)
}
  return (
    <>
    <TitleForm text='Inventario por local'></TitleForm>
    <div className="divForm">
    <SelectSimple titulo="Establecimiento"func={handleIdBranch}>
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
           {/*  <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple> */}
    </div>
    <ButtonSave titulo={"Buscar"} func={handleButton}></ButtonSave>
    {<>{ show ? <TableGet url={`${urlBase}/api/v1/existence/inventary?branch=${branch}`} minWitdh="450px"/> : <></>
    }</>}
    <ButtonSave titulo={"Prueba"} func={handleTest}></ButtonSave>
    {<>{ show2 ? <TableGet2 respJson={datos} minWitdh="450px"/> : <></>
    }</>}
    </>
    
  );
};
