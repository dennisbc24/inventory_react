import React, { useState } from "react";
import {  InputSimple,  SelectSimple, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";


//const urlBase = 'https://inventario.elwayardo.com'
const urlBase = 'http://localhost:3000'



export const NewProduct = ({urlBase}) => {
  const urlUpload = `${urlBase}/api/v1/products`
  const urlLatest = `${urlBase}/api/v1/products/latestproducts`

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
  const handleIdUser = (e) =>{  setIdUser(parseInt(e.target.value))}
  const handleIdBranch = (e) =>{  setIdBranch(parseInt(e.target.value))}

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
    <TitleForm text='Crear Nuevo Producto'></TitleForm>
      
      <div className="divForm">
      <SelectSimple titulo="Usuario" func={handleIdUser}>
          <option value="1">Dennis</option>
          <option value="2">Luz</option>
          <option value="3">Miguel</option>
        </SelectSimple>
        <SelectSimple titulo="Establecimiento"func={handleIdBranch}>
          <option value="1">B17</option>
          <option value="3">Qoripata</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <InputSimple titulo="Cantidad" tipo="number" func={handleCount}></InputSimple>
        <InputSimple titulo="Nombre" tipo="text" func={handleName}></InputSimple>
        <InputSimple titulo="Costo" tipo="number" func={handleCost}></InputSimple>
        <InputSimple titulo="Proveedor" tipo="text" func={handleSupplier}   ></InputSimple>
        <InputSimple titulo="Precio Unitario" tipo="number" func={handlePUnit}></InputSimple>
        <InputSimple titulo="Precio por Mayor" tipo="number" func={handlePMayor}></InputSimple>
        
        
      </div>
      <ButtonSave titulo={"Crear"} func={handleButton}/>
      
      <h3>Ultimos Creados</h3>
      <TableGet url='http://localhost:3000/api/v1/products/latestproducts'/>
    </>
  );
};
