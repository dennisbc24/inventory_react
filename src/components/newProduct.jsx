import React, { useEffect, useState } from "react";
import {  InputSimple,  SelectSimple, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import {ProductService} from "../services/product.js"

const service = new ProductService()

const SearchInput = ({urlApi}) => {
  const [data, setData] = useState()
  const [entry, setEntry] = useState()
  const [suggestions, setSuggestions] = useState([])

async function compare(query){
  const filteredNames = await data.filter(
    (ele) =>
    ele.name.toLowerCase().includes(query.toLowerCase()) && query != ''
    )
    .map((product) => {
      // Resalta las letras coincidentes
      const index = product.name.toLowerCase().indexOf(query.toLowerCase());
      const start = product.name.substring(0, index);
      const match = product.name.substring(index, index + query.length);
      const end = product.name.substring(index + query.length);
      return (
        <span key={product.id_product}>
          {start}
          <strong>{match}</strong>
          {end}
        </span>
      );
    });
    setSuggestions(filteredNames)

}
 async function configData (urlApi){
    const response = await axios.get(urlApi)
    setData(response.data)
  }

  useEffect(()=>{
  configData(urlApi)
  }, [])
 

  function searching({target : {value}}) {
      //setEntry(valor)
      compare(value)
      
  }
  return (
    <>
    <select>
    {/* {data.map((ele, index) => (
    <option key={index}>
      {ele}
   </option>
  ))
  } */}
    </select>
    <input type="text" onChange={searching}></input>
  <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
    <li key={index}>
      {suggestion}
   </li>
  ))}
</ul>
    </>
  
  )
}


export const NewProduct = ({urlBase}) => {
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
  const handleSupplier = ({ target: { value } }) => {SetSupplierProduct(parseInt(value))};
  const handlePUnit = (e) => {setPUnit(e.target.value)}
  const handlePMayor = (e) =>{setPMayor(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(parseInt(e.target.value))}
  const handleIdBranch = (e) =>{  setIdBranch(parseInt(e.target.value))}

  const handleButton = async () => {
    const body = {idUser,idBranch,supplierProduct,count,nameProduct,costProduct,PUnit,pMayor}
    const petition =  service.create(urlBase, body)
   }

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
        <InputSimple titulo="Proveedor" tipo="number" func={handleSupplier}   ></InputSimple>
        <SearchInput urlApi={'http://localhost:3000/api/v1/suppliers'}/>
        
        <InputSimple titulo="Precio Unitario" tipo="number" func={handlePUnit}></InputSimple>
        <InputSimple titulo="Precio por Mayor" tipo="number" func={handlePMayor}></InputSimple>
        
        
      </div>
      <ButtonSave titulo={"Crear"} func={handleButton}/>
      
      <h3>Ultimos Creados</h3>
      <TableGet url={`${urlBase}/api/v1/products/latestproducts`}/>
    </>
  );
};
