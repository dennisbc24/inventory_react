import React, { useState, useEffect } from "react";
import {  InputSimple,  ParrafoInput, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";

export const UpdateProductForm = ({urlBase}) => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [cost, setCost] = useState(0);
  const [name, setName] = useState('')
  const [p_sugerido, setP_sugerido] = useState('')
  const [p_xmayor, setP_pxmayor] = useState('')
  const [id_product, setId_Product] = useState('')
  const [show, setShow] = useState(false);

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


  const handleCost = (e) => setCost(e.target.value)
  const handleChange = (e) => {setQuery(e.target.value)}
  const handleName =(e) => setName(e.target.value)
  const handle_p_sugerido =(e) => setP_sugerido(e.target.value)
  const handle_p_xmayor =(e) => setP_pxmayor(e.target.value)

  const handleClick = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setCost(elem.cost);
          setQuery('')
          setName(elem.name)
          if (elem.list_price==null) {
            setP_sugerido(0)
          } else {
            setP_sugerido(elem.list_price)
          }
          if (elem.lowest_price==null) {
            setP_pxmayor(0)
          } else {
            setP_pxmayor(elem.lowest_price)
          }
          
          setId_Product(elem.id_product)
          setShow('true')
        }
      });
    };


  const handleButton = () => {
      
    const sendVending = async () => {
        try {
          
        const urlPatch = `${urlBase}/api/v1/products/${id_product}`
        const sendData = await axios.patch(urlPatch,{
            name: name,
            cost: cost,
            list_price: p_sugerido,
            lowest_price: p_xmayor,
        })

        console.log('modificado');
        
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }
    };
 
    sendVending()
    
    
  };
  return (
    <>
    <TitleForm text='Actualizar Producto'></TitleForm>
      <input type="text"  value={query} onChange={handleChange} placeholder="Buscar..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleClick}>
            {suggestion}
         </li>
        ))}
      </ul>
{<>{show ? <div className="divForm">
        <InputSimple titulo='Nombre' tipo='text' valor={name} func={handleName}></InputSimple>
        <InputSimple titulo='Costo' tipo='text' valor={cost} func={handleCost}></InputSimple>
        <InputSimple titulo='Precio Sugerido' tipo='number' valor={p_sugerido} func={handle_p_sugerido}></InputSimple>
        <InputSimple titulo='Precio por mayor' tipo='number' valor={p_xmayor} func={handle_p_xmayor}></InputSimple>
        <ParrafoInput titulo="Codigo" parrafo={id_product}></ParrafoInput>
        <ParrafoInput titulo="Proveedor" parrafo={product.supplier}></ParrafoInput>
        <ParrafoInput titulo="Creado" parrafo={product.created}></ParrafoInput>
        
      </div> : <></>
      }</>}
      <ButtonSave titulo={"Actualizar"} func={handleButton}/>
      
      
      
    </>
  );
};

