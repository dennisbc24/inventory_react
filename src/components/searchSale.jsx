import React, { useState } from "react";
import {  InputSimple,  SelectSimple} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet } from "./table.jsx";

//const urlBase = 'https://inventario.elwayardo.com'
const urlBase = 'http://localhost:3000'

const urlUpload = `${urlBase}/api/v1/products`
const urlLatest = `${urlBase}/api/v1/products/latestproducts`

export const SearchSale = () => {
  const [nameProduct, setNameProduct] = useState('');
  const [count, setCount] = useState(0);
  const [costProduct, SetCostProduct] = useState(0);
  const [supplierProduct, SetSupplierProduct] = useState('');
  const [pMayor, setPMayor] = useState(0);
  const [PUnit, setPUnit] = useState(0);
  const [idUser, setIdUser] = useState(1);
  const [idBranch, setIdBranch] = useState(1);

  
  const handleCount = ({ target: { value } }) => { setCount(parseInt(value))};
  const handleName = ({ target: { value } }) => { setNameProduct(value)};
  const handleCost = ({ target: { value } }) => { SetCostProduct(parseInt(value))};
  const handleSupplier = ({ target: { value } }) => {SetSupplierProduct(value)};
  const handlePUnit = (e) => {setPUnit(e.target.value)}
  const handlePMayor = (e) =>{setPMayor(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(e.target.value)}
  const handleIdBranch = (e) =>{  setIdBranch(e.target.value)}

  const handleButton = () => {
          const sendData = async () => {
      try {
        const sendData = await axios.post(urlUpload,{
          fk_user: idUser,
          fk_branch:idBranch,
          supplier:supplierProduct,
          amount: count,
          name:nameProduct,
          cost: costProduct,
          lowest_price: parseInt(PUnit),
          list_price: parseInt(pMayor),
        })

        console.log('exito');
        
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }
    };
 
    sendData()
    
    
  };
  return (
    <>
    <TitleForm text='Buscar Ventas'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="Cantidad" tipo="date" func={handleCount}></InputSimple>
    </div>
      <button onClick={handleButton}>Buscar</button>
      <TableGet/>
    </>
  );
};
