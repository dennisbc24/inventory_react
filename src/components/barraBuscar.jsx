import React, { useState, useEffect } from 'react';
import { InputSimple, SelectSimple, ParrafoInput } from "../components/form/inputSearch";
import axios from 'axios';
import './barraBuscar.css'

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [PUnit, setPUnit] = useState('');
 
  useEffect(() => {
    // Simula la carga de todos los productos al inicio
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('https://inventario.elwayardo.com/api/v1/products');
        setAllProducts(response.data);
        console.log('carga los productos al inicio');
      } catch (error) {
        console.error('Error al obtener todos los productos:', error);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    // Filtra los nombres localmente en base a la query
    const filteredNames = allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) && query !== ''
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
        setPUnit(total/count)
      
  }, [count, total]);

  const handleCount = ({target:{value}}) => {
    
    setCount(parseInt(value));
  };

  const handleTotal = ({target:{value}}) => {
    
    setTotal(parseInt(value));
  };


  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    const resultado = allProducts.find((ele) => ele.id_product == 500);
    setQuery(suggestion);
    
    setSuggestions([]); // Limpiar las sugerencias después de hacer clic
    
  };

  // const handleInputBlur = () => {
  //   // Limpiar las sugerencias si se pierde el foco en el input
  //   setSuggestions([]);
  //   console.log('limpiar sugerencias');
  // };
  
  const handleClick = (event) => {
    // Accede al texto del elemento li mediante event.target.textContent
    const textoLi = event.target.textContent;

    allProducts.forEach((elem) => {
      if (elem.name == textoLi) {
        
        setSuggestions([])
        setProduct(elem)
        
      }
    }); 
    
  };
  return (
    <>
    
    
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar..."
        //onBlur={handleInputBlur}
      />
      <ul>
        {suggestions.map((suggestion, index) => (
        <li key={index}  onClick={handleClick}>
            {suggestion}
          </li>
        ))}
      </ul>

      <div className='divForm'>
      <InputSimple titulo='Fecha' tipo='date'></InputSimple>
      <SelectSimple titulo='Sucursal'>
<option value="1">B17</option>
<option value="3">Qoripata</option>
<option value="7">Tambopata</option>
<option value="4">Deposito</option>
<option value="5">Los Nogales</option>
<option value="6">Los Incas</option>
</SelectSimple>
<SelectSimple titulo='Usuario'>
<option value="1">Dennis</option>
<option value="2">Luz</option>
<option value="3">Miguel</option>

</SelectSimple>

<InputSimple titulo='Cantidad' tipo='number' func={handleCount}></InputSimple>
        <ParrafoInput titulo='Precio Unitario' parrafo={PUnit}></ParrafoInput>
<InputSimple titulo='Total' tipo='number'func={handleTotal}></InputSimple>
        <ParrafoInput titulo='Ganancia' ></ParrafoInput>


<InputSimple titulo='Cliente' tipo='text'></InputSimple>
      <ParrafoInput titulo='Producto' parrafo={product.name}></ParrafoInput>
      <ParrafoInput titulo='Costo' parrafo={product.cost}></ParrafoInput>
      <ParrafoInput titulo='Creado' parrafo={product.created}></ParrafoInput>
      
    </div>
    </>
  );
};







