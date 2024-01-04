import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    // Simula la carga de todos los productos al inicio
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('https://inventario.elwayardo.com/api/v1/products');
        setAllProducts(response.data);
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
          <span key={product.id}>
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
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSelectedText(`La sugerencia seleccionada es: ${suggestion}`);
    setSuggestions([]); // Limpiar las sugerencias después de hacer clic
  };

  const handleInputBlur = () => {
    // Limpiar las sugerencias si se pierde el foco en el input
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar..."
        onBlur={handleInputBlur}
      />
      <ul>
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionClick(allProducts[index].name)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
      <p>{selectedText}</p>
    </div>
  );
};











