import  { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple,  ParrafoInput, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import "./css/transactions.css";

import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import noImagen from "./img/no_imagen.png";
import entregaImagen from "./icons/entrega.png";

export const TransactionsForm = ({urlBase}) => {
  const urlTransactions = `${urlBase}/api/v1/transactions`;
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [idUser, setIdUser] = useState(1);

  const [dateTrans, setDateTrans] = useState('');
  const [branchA, setBranchA] = useState(1);
  const [branchB, setBranchB] = useState(1);
  const [show, setShow] = useState(true)
  const [showStock, setShowStock] = useState(false)

  useEffect(() => {
    // Simula la carga de todos los productos al inicio
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          `${urlBase}/api/v1/products`
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
  const handleChange = (e) => {setQuery(e.target.value), setShow(false), setShowStock(false)}
  const handleDate = (e) =>{setDateTrans(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(e.target.value)}
  const handleIdBranchA = (e) =>{  setBranchA(parseInt(e.target.value))}
  const handleIdBranchB = (e) =>{  setBranchB(parseInt(e.target.value))}
  const handleClick = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setShowStock(true)
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

       
        console.log('guardado con exito');
        alert('Traslado registrado con exito')
        
      } catch (error) {
        console.error("Error al hacer petición:", error);
      }
    };
 
    sendVending()
    setShow(true)
    
    
  };
  return (
    <>
    <TitleForm text='Traslado de Mercaderia'></TitleForm>
      

      <div className="divForm">
      <input type="text"  value={query} onChange={handleChange} placeholder="Buscar producto..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleClick}>
            {suggestion}
         </li>
        ))}
      </ul>
        <p>{product.name}</p>
        <input type="date" name="fecha"  onChange={handleDate}  />
        
        <img className="product_image" src={product.url_image ? product.url_image : noImagen} ></img>
        <div className="small_box_transaction">
        <SelectSimple titulo="Desde"func={handleIdBranchA}>
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4" selected>Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <img src={entregaImagen} alt="delivery car image" />
        <SelectSimple titulo="Hacia"func={handleIdBranchB}>
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        </div>
        <div className="small_box_transaction">
        <SelectSimple titulo="Usuario" func={handleIdUser}>
          <option value="1">Dennis</option>
          <option value="2">Luz</option>
          <option value="3">Miguel</option>
        </SelectSimple>

        <InputSimple titulo="Cantidad"  tipo="number" func={handleCount} callToAction="Cuantos?" widthInput="70px"></InputSimple>
        
        </div>
        
      </div>
      <ButtonSave titulo={"Guardar"} func={handleButton}/>
      <h3>Stock</h3>
      {<>{ showStock ? <TableGet url={`${urlBase}/api/v1/existence?product=${product.id_product}`}/> : <></>
    }</>}
      <h3>Ultimas Movimientos</h3>
      {<>{ show ? <TableGet url={`${urlBase}/api/v1/transactions`} minWitdh="860px"/> : <></>
    }</>}
      
    </>
  );
};
