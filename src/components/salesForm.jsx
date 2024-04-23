import { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple,  ParrafoInput, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";

import { SalesService } from "../services/sales.js";
const saleService = new SalesService()

export const SelesForm = ({urlBase}) => {
  const [query, setQuery] = useState("");
 // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(1);
  const [cost, setCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [PUnit, setPUnit] = useState(0);
  const [dateSell, setDateSell] = useState('');
  const [dataCustomer, setDataCustomer] = useState('');
  const [idUser, setIdUser] = useState(1);
  const [idBranch, setIdBranch] = useState(1);
  const [show, setShow] = useState(false)
  const [showSales, SetShowSales] = useState(true)
  const [textButton, SetTextButton] = useState('Guardar')
 const [allProducts, setAllProducts] = useState([]);

 

      useEffect(() => {
      // Simula la carga de todos los productos al inicio
      const fetchAllProducts = async () => {
        try {
          const response = await axios.get(
            `${urlBase}/api/v1/products`
          );
          setAllProducts(response.data);
          console.log("fetch listo");
        } catch (error) { 
          console.error("Error al obtener todos los productos:", error);
        }
      };
  fetchAllProducts()
      
    }, [])
 
   useEffect(() => {
    // Filtra los nombres localmente en base a la query
    const filteredNames = allProducts
      .filter((product) =>
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
    setPUnit(total / count);
  }, [count, total]);

  useEffect(() => {
    setRevenue(((PUnit - cost) * count).toFixed(2));
  }, [PUnit]);

  const handleCount = ({ target: { value } }) => { setCount(parseInt(value))};
  const handleTotal = ({ target: { value } }) => {setTotal(parseFloat(value))};
  const handleChange = (e) => {setQuery(e.target.value), setShow(false), SetShowSales(false)}
  const handleDate = (e) =>{setDateSell(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(parseInt(e.target.value))}
  const handleIdBranch = (e) =>{  setIdBranch(parseInt(e.target.value))}
  const changeCostumer = (e) => {setDataCustomer(e.target.value)}
  const handleClick = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setCost(elem.cost);
          setQuery('')
          setShow('true')
          SetTextButton('Guardar')
        }
      });
    };


  const handleButton = () => {
    const body = {dateSell, count, total,PUnit, revenue, dataCustomer, product, idUser, idBranch}
      const upload = saleService.register(urlBase, body)
      SetShowSales(true)
    };
      
  return (
    <>
    <TitleForm text='Registrar Venta'></TitleForm>
      <input type="text" className="only_input"  value={query} onChange={handleChange} placeholder="Buscar..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleClick}>
            {suggestion}
         </li>
        ))}
      </ul>

      <div className="divForm">
        <ParrafoInput titulo="Producto" parrafo={product.name}></ParrafoInput>
        <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple>
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

        <InputSimple titulo="Cantidad" tipo="number" func={handleCount} callToAction="Cuantos?"></InputSimple>
        <ParrafoInput titulo="Precio Unitario" parrafo={PUnit}></ParrafoInput>
        <InputSimple titulo="Total S/." tipo="number" func={handleTotal} callToAction="Total Venta"></InputSimple>

        <InputSimple titulo="Cliente" tipo="text" func={changeCostumer} callToAction="Cliente"></InputSimple>

        <ParrafoInput titulo="Costo" parrafo={cost}></ParrafoInput>
        <ParrafoInput titulo="Ganancia" parrafo={revenue}></ParrafoInput>
        <ParrafoInput titulo="Creado" parrafo={product.created}></ParrafoInput>
      </div>
      
      <ButtonSave titulo={textButton} func={handleButton}/>
      <h3>Stock</h3>
      {<>{ show ? <TableGet url={`${urlBase}/api/v1/existence?product=${product.id_product}`}/> : <></>
    }</>}
      <h3>Ultimas Ventas</h3>

      {<>{ showSales ? <TableGet url={`${urlBase}/api/v1/ventas`}/> : <></>
    }</>}
      
      
        
      
      
    </>
  );
};
