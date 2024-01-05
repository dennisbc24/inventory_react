import React, { useState, useEffect } from 'react';
import { ParrafoInput } from "../components/form/inputSearch";
import axios from 'axios';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product_name, setProduct_name] = useState('');

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

  const handleChange = (e) => {
    setQuery(e.target.value);
    console.log('setQuery e.target.value');
  };

  const handleSuggestionClick = (suggestion) => {
    console.log(`la sugerencia es${suggestion}`);
    const resultado = allProducts.find((ele) => ele.id_product == 500);
  
  console.log(resultado); 
  console.log(`la sugerencia es${suggestion}`);
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
        console.log(elem)
        setSuggestions([])
        setProduct_name(elem.name)
        
      }
    });

    // Haz lo que necesites con el texto capturado
    console.log(event);
    console.log('Texto del li clicado:', textoLi);
  };
  return (
    <div>
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

      <ParrafoInput titulo='Producto' parrafo={product_name}></ParrafoInput>
    </div>
  );
};







