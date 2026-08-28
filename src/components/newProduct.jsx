import { useState } from "react";
import {  InputSimple, ParrafoInput, SearchInput} from "./form/inputSearch";
import imageCompression from "browser-image-compression";
import "./salesForm.css";
import axios from 'axios';
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";

export const NewProduct = ({urlBase}) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0.00);
  const [lowest_price, setLowest_price] = useState(0.00);
  const [list_price, setList_price] = useState(0.00);
  const [proveedor, setProveedor] = useState([{name:'',id_supplier:0}]);
  const [categoria, setCategoria] = useState({name:'',id_category:0});
  const [isOnline, setIsOnline] = useState(false);

  const [photo, setPhoto] = useState(null);
 
  const handleName = ({ target: { value } }) => { setName(value)};
  const handleCost = ({ target: { value } }) => { setCost(parseFloat(value))};
  const handlePUnit = ({ target: { value } }) => { setList_price(parseFloat(value))};
  const handlePMayor = ({ target: { value } }) => { setLowest_price(parseFloat(value))};

  const handleInputFileChange = async (e) => {
    const img = e.target.files[0];
    if (!img) return;
    const options = { maxSizeMB: 1, maxWidthOrHeight: 700, useWebWorker: true };
    try {
      const compressed = await imageCompression(img, options);
      setPhoto(compressed);
    } catch (err) {
      console.error("Error al comprimir imagen", err);
      setPhoto(img);
    }
  };
 
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // console.log(photo);
    // formData.append('photo', photo);
    console.log(name,cost, list_price, lowest_price, proveedor.id_supplier, photo);
    
    formData.append('name', name);
    formData.append('cost', cost);
    formData.append('list_price', list_price);
    formData.append('lowest_price', lowest_price);
    // compat: backend legacy también acepta unit/total -> enviar ambos
    formData.append('unit', list_price);
    formData.append('total', lowest_price);
    formData.append('fk_supplier', proveedor.id_supplier);
    formData.append('fk_category', categoria.id_category || '');
    formData.append('is_online', isOnline ? 'true' : 'false');
    formData.append('photo', photo);

    try {
      //console.log(formData.getAll('photo'));
      const urlPost = `${urlBase}/api/v1/products/`
      console.log(urlPost);
      
      const response = await axios.post(urlPost, formData, {});
      console.log('Response:', response.data);
      alert(`Producto con el nomnbre ${name} ha sido creado`)
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  };

  return (
    <>
    <main>
      <TitleForm text='Crear Nuevo Producto'></TitleForm>
<form onSubmit={handleSubmit2} encType='multipart/form-data'>
    <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={setProveedor} place="Buscar Proveedor"/>
    <SearchInput urlApi={`${urlBase}/api/v1/categories`} funcSet={setCategoria} place="Buscar Categoría"/>
       
      <InputSimple titulo="Nombre" tipo="text" func={handleName} nombre='name' callToAction="Escribe un nombre único"></InputSimple>
      <InputSimple titulo="Costo S/." tipo="number" step="any" func={handleCost} nombre='cost'></InputSimple>
      <InputSimple titulo="P. Unit S/." tipo="number" step="any" func={handlePUnit} nombre='unit'></InputSimple>
      <InputSimple titulo="Cargar Archivo" tipo="file" func={handleInputFileChange} nombre='photo'></InputSimple>
      <InputSimple titulo="P. Mayor S/." tipo="number" step="any" func={handlePMayor} nombre='total'></InputSimple>
      <div className='inputSimple'>
        <h3>Venta online</h3>
        <label style={{display:'flex',gap:8,alignItems:'center'}}>
          <input type="checkbox" checked={isOnline} onChange={e=>setIsOnline(e.target.checked)} /> Habilitar para ecommerce
        </label>
      </div>
      <ParrafoInput titulo={'Proveedor'} parrafo={proveedor.name}/>
      <ParrafoInput titulo={'Categoría'} parrafo={categoria.name}/>
      <ParrafoInput titulo={'Online'} parrafo={isOnline ? 'Sí - visible en shop' : 'No'}/>
      <button type="submit">Crear</button>
    </form>
    
    </main>
    
      <div className="divForm">
        {/* <UploadPhoto></UploadPhoto> */}
        
        {/* <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={setProveedor} place="Buscar Proveedor"/> */}
        
        
      </div>
      {/* <ButtonSave titulo={"Crear"} func={handleButton}/> */}
      <h3>Ultimos Creados</h3>
      <TableGet url={`${urlBase}/api/v1/products/latestproducts`}/>
    </>
  );
};

