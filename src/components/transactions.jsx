import React, { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple,  ParrafoInput,} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";


//const urlBase = "https://inventario.elwayardo.com";
const urlBase = 'http://localhost:3000'

const urlTransactions = `${urlBase}/api/v1/transactions`;

export const TransactionsForm = () => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState('');
  const [idUser, setIdUser] = useState(1);

  const [dateTrans, setDateTrans] = useState('');
  const [branchA, setBranchA] = useState('');
  const [branchB, setBranchB] = useState('');

  useEffect(() => {
    // Simula la carga de todos los productos al inicio
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          "https://inventario.elwayardo.com/api/v1/products"
        );
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
  const handleChange = (e) => {setQuery(e.target.value)}
  const handleDate = (e) =>{setDateTrans(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(e.target.value)}
  const handleIdBranchA = (e) =>{  setBranchA(e.target.value)}
  const handleIdBranchB = (e) =>{  setBranchB(e.target.value)}
  const handleClick = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          
          setQuery('')
        }
      });
    };


  const handleButton = () => {
      
    const sendVending = async () => {
      try {
        const sendData = await axios.post(urlTransactions,{
            pointA: branchA,
            pointB: branchB,
            amount: count,
            fk_user:idUser,
            date: dateTrans,
            fk_product: product.id_product
        })

       
        console.log('guardado');
        
      } catch (error) {
        console.error("Error al hacer petición:", error);
      }
    };
 
    sendVending()
    
    
  };
  return (
    <>
    <TitleForm text='Traslado de Mercaderia'></TitleForm>
      <input type="text"  value={query} onChange={handleChange} placeholder="Buscar..." />
      <ul>   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleClick}>
            {suggestion}
         </li>
        ))}
      </ul>

      <div className="divForm">
        <ParrafoInput titulo="Producto" parrafo={product.name}></ParrafoInput>
        <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple>
        <SelectSimple titulo="Origen"func={handleIdBranchA}>
          <option value="1">B17</option>
          <option value="3">Qoripata</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <SelectSimple titulo="Destino"func={handleIdBranchB}>
          <option value="1">B17</option>
          <option value="3">Qoripata</option>
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

        <InputSimple titulo="Cantidad"  tipo="number" func={handleCount}></InputSimple>
        
      </div>
      <button onClick={handleButton}>Guardar</button>
      <h3>Ultimas Movimientos</h3>
      
    </>
  );
};
