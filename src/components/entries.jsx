import React, { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple,  ParrafoInput,} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";

export const EntriesForm = ({urlBase}) => {
  const urlEntries = `${urlBase}/api/v1/entries`;
const urlSuppliers = `${urlBase}/api/v1/suppliers`;
const urlApiProducts = `${urlBase}/api/v1/products`;

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [allSuppliers, setAllSuppliers] = useState([]); // Array con todos los suppliers
  const [querySuppliers, setQuerySuppliers] = useState(""); // Array con todos los suppliers
  const [supplier, setSupplier] = useState([]);
  const [suggestionsSupplier, setSuggestionsSupplier] = useState([]);
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
    // Simula la carga de todos los productos al inicio
    const fetchAllSuppliers = async () => {
      try {
        const response = await axios.get(urlSuppliers);
        setAllSuppliers(response.data);
      } catch (error) {
        console.error("Error al obtener todos los suppliers:", error);
      }
    };

    fetchAllSuppliers();
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

  useEffect(() => {
    // Filtra los nombres localmente en base a la querySuppliers
    const filteredNamesSuppliers = allSuppliers
      .filter((elem) => elem.name.toLowerCase().includes(querySuppliers.toLowerCase()) && querySuppliers !== "" )
      .map((elem) => {
        // Resalta las letras coincidentes
        const index = elem.name.toLowerCase().indexOf(querySuppliers.toLowerCase());
        const start = elem.name.substring(0, index);
        const match = elem.name.substring(index, index + querySuppliers.length);
        const end = elem.name.substring(index + querySuppliers.length);
        return (
          <span key={elem.id_supplier}>
            {start}
            <strong>{match}</strong>
            {end}
          </span>
        );
      });

      setSuggestionsSupplier(filteredNamesSuppliers);
  }, [querySuppliers, allSuppliers]);


  const handleCount = ({ target: { value } }) => { setCount(parseInt(value))};
  const handleChangeProducts = (e) => {setQuery(e.target.value), setShow(false)}
  const handleChangeSuppliers = (e) => {setQuerySuppliers(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(e.target.value)}
  const handleIdBranch = (e) =>{  setIdBranch(e.target.value)}
  

  const handleSearchProducts = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setId_Product(elem.id_product)
          setShow('true')
          setQuery('')
        }
      });
    };
    const handleSearchSuppliers = (event) => { 
        const textoLi = event.target.textContent
          allSuppliers.forEach((elem) => {
            if (elem.name == textoLi) {
              setSuggestionsSupplier([]);
              setSupplier(elem);
              setQuerySuppliers('')
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
            fk_supplier:supplier.id_supplier,
            fk_product: idProduct ,
            /* string_supplier: newSupplier.value */
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
      <ul>   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleSearchProducts}>
            {suggestion}
         </li>
        ))}
      </ul>
      <input type="text"  value={querySuppliers} onChange={handleChangeSuppliers} placeholder="Buscar proveedor..." />
      <ul>   {suggestionsSupplier.map((suggestion, index) => (
          <li key={index} onClick={handleSearchSuppliers}>
            {suggestion}
         </li>
        ))}
      </ul>

      <div className="divForm">
        <ParrafoInput titulo="Producto" parrafo={product.name}></ParrafoInput>
        <ParrafoInput titulo="Proveedor" parrafo={supplier.name}></ParrafoInput>
        <SelectSimple titulo="Sucursal"func={handleIdBranch}>
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <SelectSimple titulo="Usuario" func={handleIdUser}>
          <option value="1">Dennis</option>
          <option value="2">Luz</option>
          <option value="3">Miguel</option>
        </SelectSimple>
        <InputSimple titulo="Cantidad" tipo="number" func={handleCount} ></InputSimple>
      </div>
      <button onClick={handleButton}>Guardar</button>
      {<>{ show ? <TableGet url={`${urlBase}/api/v1/existence?product=${idProduct}`}/> : <></>
    }</>}
      
      <h3>Ultimos Ingresos</h3>
      <TableGet url={`${urlBase}/api/v1/entries`}/>
    </>
  );
};
