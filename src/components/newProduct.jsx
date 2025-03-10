import {useEffect, useState } from "react";
import {  InputSimple, ButtonSave, ParrafoInput, SearchInput} from "./form/inputSearch";
import "./salesForm.css";
import axios from 'axios';
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import {ProductService} from "../services/product.js"
//import { UploadPhoto } from "./inputs/upload_img.jsx";

const service = new ProductService()

export const NewProduct = ({urlBase}) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0);
  const [lowest_price, setLowest_price] = useState(0);
  const [list_price, setList_price] = useState(0);
  const [proveedor, setProveedor] = useState([{name:'',id_supplier:0}]);

  const [photo, setPhoto] = useState(null);
 
  const handleName = ({ target: { value } }) => { setName(value)};
  const handleCost = ({ target: { value } }) => { setCost(value)};
  const handlePUnit = ({ target: { value } }) => { setList_price(value)};
  const handlePMayor = ({ target: { value } }) => { setLowest_price(value)};

  const handleInputFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };
 
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // console.log(photo);
    // formData.append('photo', photo);
    console.log(name,cost, list_price, lowest_price, proveedor.id_supplier, photo);
    
    formData.append('name', name);
    formData.append('cost', cost);
    formData.append('unit', list_price);
    formData.append('total', lowest_price);
    formData.append('fk_supplier', proveedor.id_supplier);
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
    <form onSubmit={handleSubmit2} encType='multipart/form-data'>
    <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={setProveedor} place="Buscar Proveedor"/>
       
      <InputSimple titulo="Nombre" tipo="text" func={handleName} nombre='name' callToAction="Escribe un nombre único"></InputSimple>
      <InputSimple titulo="Costo S/." tipo="number" func={handleCost} nombre='cost'></InputSimple>
      <InputSimple titulo="P. Unit S/." tipo="number" func={handlePUnit} nombre='unit'></InputSimple>
      <InputSimple titulo="Cargar Archivo" tipo="file" func={handleInputFileChange} nombre='photo'></InputSimple>
      <InputSimple titulo="P. Mayor S/." tipo="number" func={handlePMayor} nombre='total'></InputSimple>
      <ParrafoInput titulo={'Proveedor'} parrafo={proveedor.name}/>
      <button type="submit">Crear</button>
    </form>
    <TitleForm text='Crear Nuevo Producto'></TitleForm>
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

