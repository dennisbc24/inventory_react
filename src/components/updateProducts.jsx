import { useState, useEffect } from "react";
import {  InputSimple,  ParrafoInput, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import noImagen from "./img/no_imagen.png";
import imageCompression from "browser-image-compression";

export const UpdateProductForm = ({urlBase}) => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [id_product, setId_Product] = useState('')
  const [show, setShow] = useState(false);
  const [sugested_price, setSugested_price] = useState('')
  const [wholesale_price, setWholesale_price] = useState('')
  const [name, setName] = useState('')
  const [cost, setCost] = useState(0)
  const [photo, setPhoto] = useState(null);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cost', cost);
    formData.append('sugested_price', sugested_price);
    formData.append('wholesale_price', wholesale_price);
    formData.append('name', name);
    formData.append('nameFile', name.replaceAll(' ','+' ));
    formData.append('photo', photo);
    console.log(formData);
    
    try {
          
      const urlPatch = `${urlBase}/api/v1/products/${id_product}`
      console.log(urlPatch);
      const sendData = await axios.patch(urlPatch, formData)
      console.log(sendData);
      
      alert(sendData.data);
      
    } catch (error) {
      console.error("Error al hacer el patch:", error);
    }
  };

  const handleChange = (e) => {setQuery(e.target.value)}
  const handleCost = (e) => setCost(parseFloat(e.target.value))
  const handleName = (e) => setName(e.target.value)
  const handleSuggestedPrice = (e) => setSugested_price(parseFloat(e.target.value))
  const handleWholeSalePrice = (e) => setWholesale_price(parseFloat(e.target.value))


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
            setSugested_price(0)
          } else {
            setSugested_price(elem.list_price)
          }
          if (elem.lowest_price==null) {
            setWholesale_price(0)
          } else {
            setWholesale_price(elem.lowest_price)
          }
          
          setId_Product(elem.id_product)
          setShow('true')
        }
      });
    };

   const handleInputFileChange = async (e) => {
      const img = e.target.files[0];
       if (img) {
         const options = {
           maxSizeMB: 1, // Tamaño máximo en MB
           maxWidthOrHeight: 700, // Máximo en píxeles
           useWebWorker: true,
         };
         try {
           const compressedFile = await imageCompression(img, options);
           setPhoto(compressedFile);
         } catch (error) {
          console.error("Error al comprimir la imagen", error);
       }
       }


      //setPhoto(img);  
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
{<>{show ? <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <ParrafoInput titulo="Actualizado" parrafo={product.updated}></ParrafoInput>
          <img className="product_image" src={product.url_image ? product.url_image : noImagen} ></img>

        <InputSimple titulo='Nombre' tipo='text' valor={name} func={handleName} nombre='name'></InputSimple>
        
        <InputSimple titulo='Costo' tipo='number' valor={cost} func={handleCost} nombre='cost'></InputSimple>
        <InputSimple titulo='Precio Sugerido' tipo='number' valor={sugested_price} func={handleSuggestedPrice} nombre='sugested_price'></InputSimple>
        <InputSimple titulo='Precio por mayor' tipo='number' valor={wholesale_price} func={handleWholeSalePrice} nombre='wholesale_price'></InputSimple>
        <InputSimple titulo="Subir Imagen" tipo="file" func={handleInputFileChange} nombre='image_product'></InputSimple>
          <ParrafoInput titulo="Codigo" parrafo={id_product}></ParrafoInput>
          <ParrafoInput titulo="Proveedor" parrafo={product.supplier}></ParrafoInput>
          <ParrafoInput titulo="Creado" parrafo={product.created}></ParrafoInput>

        <button type="submit">Upload</button>

      </form> : <></>
      }</>}
      
      
      
    </>
  );
};

