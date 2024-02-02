import React, { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple,  ParrafoInput,} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";

export const SelesForm = ({urlBase}) => {
  const urlUploadVendings = `${urlBase}/api/v1/ventas/vendings`;
  const urlUMofifyExistence = `${urlBase}/api/v1/existence/vendings`;

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
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

  useEffect(() => {
    setPUnit(total / count);
  }, [count, total]);

  useEffect(() => {
    setRevenue((PUnit - cost) * count);
  }, [PUnit]);

  const handleCount = ({ target: { value } }) => { setCount(parseInt(value))};
  const handleTotal = ({ target: { value } }) => {setTotal(parseInt(value))};
  const handleChange = (e) => {setQuery(e.target.value), setShow(false), SetShowSales(false)}
  const handleDate = (e) =>{setDateSell(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(e.target.value)}
  const handleIdBranch = (e) =>{  setIdBranch(e.target.value)}
  const changeCostumer = (e) => {setDataCustomer(e.target.textContent)}
  const handleClick = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setCost(elem.cost);
          setQuery('')
          setShow('true')
          
        }
      });
    };


  const handleButton = () => {
      
    const sendVending = async () => {
      try {
        const sendData = await axios.post(urlUploadVendings,{
          date: dateSell,
          amount: count,
          p_total: total,
          p_unit: parseInt(PUnit),
          revenue: parseInt(revenue),
          customer: dataCustomer,
          fk_id_product: product.id_product,
          fk_id_user: idUser,
          fk_id_branch:idBranch,
          branch:'nuevo',
          product:product.name
        })

        const modifyExistence = await axios.patch(urlUMofifyExistence,{
          amount: count, 
          fk_branch: idBranch, 
          fk_product:product.id_product, 
          fk_user:idUser
        })
        console.log('guardado');
        
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }
    };
    
    sendVending()
    SetShowSales(true)
    setShow(false)
    
    
  };
  return (
    <>
    <TitleForm text='Registrar Venta'></TitleForm>
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
        <SelectSimple titulo="Sucursal"func={handleIdBranch}>
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

        <InputSimple titulo="Cantidad" tipo="number" func={handleCount} ></InputSimple>
        <ParrafoInput titulo="Precio Unitario" parrafo={PUnit}></ParrafoInput>
        <InputSimple titulo="Total" tipo="number" func={handleTotal}></InputSimple>

        <InputSimple titulo="Cliente" tipo="text" func={changeCostumer}></InputSimple>

        <ParrafoInput titulo="Costo" parrafo={cost}></ParrafoInput>
        <ParrafoInput titulo="Ganancia" parrafo={revenue}></ParrafoInput>
        <ParrafoInput titulo="Creado" parrafo={product.created}></ParrafoInput>
      </div>
      <button onClick={handleButton}>Guardar</button>
      <h3>Stock</h3>
      {<>{ show ? <TableGet url={`${urlBase}/api/v1/existence?product=${product.id_product}`}/> : <></>
    }</>}
      <h3>Ultimas Ventas</h3>

      {<>{ showSales ? <TableGet url={`${urlBase}/api/v1/ventas`}/> : <></>
    }</>}
      
      
        
      
      
    </>
  );
};
