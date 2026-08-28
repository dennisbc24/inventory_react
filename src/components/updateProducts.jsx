import { useState, useEffect } from "react";
import {  InputSimple,  ParrafoInput, SearchInput} from "./form/inputSearch";
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
  const [fk_category, setFk_category] = useState('')
  const [categoriaObj, setCategoriaObj] = useState({name:'', id_category: ''})
  const [isOnline, setIsOnline] = useState(false)
  const [photo, setPhoto] = useState(null);
  const [fileKey, setFileKey] = useState(0);

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
    formData.append('fk_category', fk_category);
    formData.append('is_online', isOnline ? 'true' : 'false');
    formData.append('name', name);
    formData.append('nameFile', name.replaceAll(' ','+' ));
    formData.append('photo', photo);
    console.log(formData);
    
    try {
          
      const urlPatch = `${urlBase}/api/v1/products/${id_product}`
      const sendData = await axios.patch(urlPatch, formData)
      alert(sendData.data);
      // limpiar para evitar repetir
      setQuery(''); setSuggestions([]); setProduct([]); setId_Product(''); setShow(false);
      setName(''); setCost(0); setSugested_price(''); setWholesale_price(''); setFk_category(''); setCategoriaObj({name:'',id_category:''}); setIsOnline(false); setPhoto(null); setFileKey(k=>k+1);
      const form = document.querySelector('form'); if(form) form.reset();
      
    } catch (error) {
      console.error("Error al hacer el patch:", error);
      alert(error?.response?.data?.message || 'Error al actualizar');
    }
  };

  const handleChange = (e) => {setQuery(e.target.value)}
  const handleCost = (e) => setCost(e.target.value)
  const handleName = (e) => setName(e.target.value)
  const handleSuggestedPrice = (e) => setSugested_price(e.target.value)
  const handleWholeSalePrice = (e) => setWholesale_price(e.target.value)
  const handleCategory = (e) => setFk_category(e.target.value)
  // sincroniza selector SearchInput con fk_category
  useEffect(()=>{ if(categoriaObj?.id_category) setFk_category(categoriaObj.id_category)},[categoriaObj])


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
          setFk_category(elem.fk_category || '')
          setCategoriaObj({name: elem.category_name || '', id_category: elem.fk_category || ''})
          setIsOnline(!!elem.is_online)
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
        
        <InputSimple titulo='Costo' tipo='number' step="any" valor={cost} func={handleCost} nombre='cost'></InputSimple>
        <InputSimple titulo='Precio Sugerido' tipo='number' step="any" valor={sugested_price} func={handleSuggestedPrice} nombre='sugested_price'></InputSimple>
        <InputSimple titulo='Precio por mayor' tipo='number' step="any" valor={wholesale_price} func={handleWholeSalePrice} nombre='wholesale_price'></InputSimple>
        <SearchInput urlApi={`${urlBase}/api/v1/categories`} funcSet={setCategoriaObj} place="Buscar Categoría (cambiar)"/>
        <InputSimple titulo='Categoría ID' tipo='number' valor={fk_category} func={handleCategory} nombre='fk_category' callToAction="ID categoría (ver lista)"></InputSimple>
        <div className='inputSimple'>
          <h3>Venta online</h3>
          <label style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="checkbox" checked={isOnline} onChange={e=>setIsOnline(e.target.checked)} /> Habilitar para ecommerce
          </label>
        </div>
        <InputSimple key={fileKey} titulo="Subir Imagen" tipo="file" func={handleInputFileChange} nombre='image_product'></InputSimple>
        <ParrafoInput titulo="Categoría actual" parrafo={product.category_name || 'Sin categoría'}></ParrafoInput>
        <ParrafoInput titulo="Categoría seleccionada" parrafo={categoriaObj.name || '—'}></ParrafoInput>
        <ParrafoInput titulo="Online actual" parrafo={product.is_online ? 'Sí' : 'No'}></ParrafoInput>
          <ParrafoInput titulo="Codigo" parrafo={id_product}></ParrafoInput>
          <ParrafoInput titulo="Proveedor" parrafo={product.supplier}></ParrafoInput>
          <ParrafoInput titulo="Creado" parrafo={product.created}></ParrafoInput>

        <button type="submit">Upload</button>

      </form> : <></>
      }</>}
      
      
      
    </>
  );
};

