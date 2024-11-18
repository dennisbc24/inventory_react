import React, { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple,  ParrafoInput, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm} from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import noImagen from "./img/no_imagen.png";
export const EntriesForm = ({urlBase}) => {
  const urlEntries = `${urlBase}/api/v1/entries`;
const urlSuppliers = `${urlBase}/api/v1/suppliers`;
const urlApiProducts = `${urlBase}/api/v1/products`;

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [idUser, setIdUser] = useState(1);
  const [idBranch, setIdBranch] = useState(1);
  const [idProduct, setId_Product] = useState(1);
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Simula la carga de todos los productos al inicio
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(urlApiProducts);
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }
    };

    fetchAllProducts();
  }, []);

 

  useEffect(() => {
    // Filtra los nombres localmente en base a la query
    const filteredNames = allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) &&
          query !== ""
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

    setSuggestions(filteredNames);
  }, [query, allProducts]);

  const handleCount = ({ target: { value } }) => { setCount(parseInt(value))};
  const handleChangeProducts = (e) => {setQuery(e.target.value), setShow(false)}
  const handleChangeSuppliers = (e) => {setQuerySuppliers(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(parseInt(e.target.value))}
  const handleIdBranch = (e) =>{  setIdBranch(parseInt(e.target.value))}
  

  const handleSearchProducts = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setId_Product(elem.id_product)
          setShow(true)
          setQuery('')
        }
      });
    };
    
const handleButton = () => {
      
    const sendVending = async () => {
      try {
        const sendEntry = await axios.post(urlEntries,{
            pointB: idBranch,
            amount: count,
            fk_user:idUser,
            fk_product: idProduct
        })
        
        console.log('guardado');
        
      } catch (error) {
        console.error("Error al guardar Entry :", error);
      }
    };
 
    sendVending()
    
    
  };
  return (
    <>
    <TitleForm text='Ingreso de Producto'></TitleForm>
      <input type="text"  value={query} onChange={handleChangeProducts} placeholder="Buscar producto..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleSearchProducts}>
            {suggestion}
         </li>
        ))}
      </ul>
      

      <div className="divForm">
        <ParrafoInput titulo="Producto" parrafo={product.name}></ParrafoInput>
        <SelectSimple titulo="Sucursal"func={handleIdBranch}>
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <img className="product_image" src={product.url_image ? product.url_image : noImagen} ></img>

        <SelectSimple titulo="Usuario" func={handleIdUser}>
          <option value="1">Dennis</option>
          <option value="2">Luz</option>
          <option value="3">Miguel</option>
        </SelectSimple>
        <InputSimple titulo="Cantidad" tipo="number" func={handleCount} callToAction="Cuantos ingresan?"></InputSimple>
      </div>
      <ButtonSave titulo={"Guardar"} func={handleButton}/>
      
      {<>{ show ? <TableGet url={`${urlBase}/api/v1/existence?product=${idProduct}`}/> : <></>
    }</>}
      
      <h3>Ultimos Ingresos</h3>
      <TableGet url={`${urlBase}/api/v1/entries`} minWitdh="735px"/>
    </>
  );
};
