import React, {useState } from "react";
import {  InputSimple, ButtonSave, ParrafoInput, SearchInput} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import {ProductService} from "../services/product.js"

const service = new ProductService()

export const NewProduct = ({urlBase}) => {
  const [nameProduct, setNameProduct] = useState('');
  const [costProduct, SetCostProduct] = useState(0);
  const [pMayor, setPMayor] = useState(0);
  const [PUnit, setPUnit] = useState(0);
  const [proveedor, setProveedor] = useState([{name:'',id_supplier:0}]);

  const handleName = ({ target: { value } }) => { setNameProduct(value)};
  const handleCost = ({ target: { value } }) => { SetCostProduct(parseInt(value))};
  const handlePUnit = (e) => {setPUnit(e.target.value)}
  const handlePMayor = (e) =>{setPMayor(e.target.value)}
  

  const handleButton = async () => {
    const body = {proveedor,nameProduct,costProduct,PUnit,pMayor}
    const petition =  service.create(urlBase, body)
   }

  return (
    <>
    <TitleForm text='Crear Nuevo Producto'></TitleForm>
      <div className="divForm">
        <InputSimple titulo="Nombre" tipo="text" func={handleName} callToAction="Escribe un nombre único"></InputSimple>
        <ParrafoInput titulo={'Proveedor'} parrafo={proveedor.name}/>
        <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={setProveedor}/>
        
        <InputSimple titulo="Costo S/." tipo="number" func={handleCost}></InputSimple>
        <InputSimple titulo="P. Unit S/." tipo="number" func={handlePUnit}></InputSimple>
        <InputSimple titulo="P. Mayor S/." tipo="number" func={handlePMayor}></InputSimple> 
      </div>
      <ButtonSave titulo={"Crear"} func={handleButton}/>
      <h3>Ultimos Creados</h3>
      <TableGet url={`${urlBase}/api/v1/products/latestproducts`}/>
    </>
  );
};
