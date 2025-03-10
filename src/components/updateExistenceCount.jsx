import { useState, useEffect } from "react";
import {  InputSimple,  ParrafoInput, ButtonSave, SelectSimple} from "./form/inputSearch";
import axios from "axios";
import "./css/updateExistenceCount.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import noImagen from "./img/no_imagen.png";

export const UpdateExistenceCount = ({urlBase}) => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [cost, setCost] = useState(0);
  const [name, setName] = useState('')
  const [id_product, setId_Product] = useState('')
  const [show, setShow] = useState(false);
  const [idBranch, setIdBranch] = useState(0);
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(true);

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

// 

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

  const handleChange = (e) => {setQuery(e.target.value), setShow(false)}
  const handleIdBranch = (e) =>{  setIdBranch(parseInt(e.target.value))}
  const handleCount = (e) =>{  
    
    setCount(parseInt(e.target.value))
    setDisabled(false)
  }
    

  const handleClick = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setCost(elem.cost);
          setQuery('')
          setName(elem.name)
          setId_Product(elem.id_product)
          setShow('true')
        }
      });
    };


  const handleButton = () => {
      
    const sendVending = async () => {
        try {
        const urlPatch = `${urlBase}/api/v1/existence/count`
        const sendData = await axios.patch(urlPatch,{
          id_product,
          id_branch:idBranch, 
          count
        })
        alert(sendData.data);
        
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }
    };
 
    sendVending()
    setShow(false)
    setDisabled(true)
    setIdBranch(0)
    
  };
  return (
    <>
      <TitleForm text='Actualizar Stock'></TitleForm>
      <input type="text"  value={query} onChange={handleChange} placeholder="Buscar Producto..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleClick}>
            {suggestion}
         </li>
        ))}
      </ul>
      <h3>Stock</h3>
      {show ? <TableGet url={`${urlBase}/api/v1/existence?product=${product.id_product}`}/> : <></>}
{<>{show ? 
    <div className="divFormTwo">
      <section className="form">
          <ParrafoInput titulo="Codigo" parrafo={id_product}></ParrafoInput>
          <SelectSimple titulo="Sucursal" func={handleIdBranch}>
              <option value={idBranch}>Elige un local</option>
              <option value="1">B17</option>
              <option value="3">Departamento</option>
              <option value="7">Tambopata</option>
              <option value="4">Deposito</option>
              <option value="5">Los Nogales</option>
              <option value="6">Los Incas</option>
        </SelectSimple>
         {idBranch !== 0 ? <InputSimple tipo={'number'} titulo='Cantidad' func={handleCount}/> : <></>}   
        
        <ParrafoInput titulo="Costo" parrafo={cost}></ParrafoInput>
        <ParrafoInput titulo="Creado" parrafo={product.created}></ParrafoInput>
        
      </section>
      <section>
      <ParrafoInput titulo="Nombre" parrafo={name}></ParrafoInput>

        <img className="product_image" src={product.url_image ? 
              product.url_image : 
              noImagen} ></img>
      </section>
      </div> : <></>
      }</>}
      
      {/* <PopUpWindow text={'ventana emergente'}></PopUpWindow> */}
      
      <button onClick={handleButton} disabled={disabled}>Actualizar</button>
      
      
      
    </>
  );
};

