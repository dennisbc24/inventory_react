import { useState, useEffect } from "react";
import { SelectSimple, ButtonSave} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import axios from "axios";

import {  TableGet, TableGet2 } from "./table.jsx";
import {InventoryService} from "../services/inventory.js"
const service = new InventoryService()
export const Inventory = ({urlBase}) => {
  
  const [branch, setBranch] = useState(1);
  const [branch2, setBranch2] = useState(4);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [datos, setDatos] = useState(undefined);
  const [review, setReview] = useState(1);
  const [baseCount, setBaseCount] = useState(0);


     
  const handleIdBranch = ({ target: { value } }) => { setBranch(parseInt(value)), setShow(false)};
  const handleIdBranch2 = ({ target: { value } }) => { setBranch2(parseInt(value)), setShow2(false)};
  const handleBaseCount = ({ target: { value } }) => { setBaseCount(parseInt(value)), setShow2(false)};

  const handleButton = () => {setShow(true), setShow2(false)}
  const handleReview = ({target: {value}}) => {setReview(parseInt(value)), setShow2(false), setShow(false)}
  
  useEffect(()=>{
    const getData = async () => {
  try {
    const data = await axios.get(`${urlBase}/api/v1/existence/inventary?branch=${branch}`)
  setDatos(data.data)
  setShow(true)
  } catch (error) {
    console.error(error);
  }
    }
    getData()
      },[])
const handleTest = async () =>{
  const {sortArray} =  await service.CompareInventories({store:branch,deposit:branch2, urlBase, baseCount})
  setDatos(sortArray)
  setShow(false)
  setShow2(true)
}
  return (
    <>
    <SelectSimple titulo="Revisar"func={handleReview}>
          <option value="1">Inventario por local</option>
          <option value="3">Diferencia por local</option>
          
        </SelectSimple>
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
    <>
      
       { review === 1 ?
          (
          <ButtonSave titulo={"Buscar"} func={handleButton}></ButtonSave>)
        
        : (
          <>
          <SelectSimple titulo="Comparar con.."func={handleIdBranch2}>
          <option value="4">Deposito</option>
          
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="1">B17</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <SelectSimple titulo="Cantidad base"func={handleBaseCount}>
        <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          
        </SelectSimple>
          <ButtonSave titulo={"Comparar"} func={handleTest}></ButtonSave>
          </>
        )}
             
    </>
    {<>{ show ? <TableGet url={`${urlBase}/api/v1/existence/inventary?branch=${branch}`} minWitdh="450px"/> : <></>}</>}
    {/* {<> {show ? { datos.map( item => {
          return (<div>
              <p>{item.name}</p>
            </div> );
        })}
      : <></>}</>} */}
        {<>{ show2 ? <TableGet2 respJson={datos} minWitdh="450px"/> : <></>}</>}
    </>
    
  );
};
