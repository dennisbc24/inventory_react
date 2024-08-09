import {useState } from "react";
import {  InputSimple, ButtonSave, ParrafoInput, SearchInput} from "./form/inputSearch";
import "./salesForm.css";
import axios from 'axios';
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import {ProductService} from "../services/product.js"
import { UploadPhoto } from "./inputs/upload_img.jsx";

const service = new ProductService()

export const NewProduct = ({urlBase}) => {
  const [nameProduct, setNameProduct] = useState('');
  const [costProduct, SetCostProduct] = useState(0);
  const [pMayor, setPMayor] = useState(0);
  const [PUnit, setPUnit] = useState(0);
  const [proveedor, setProveedor] = useState([{name:'',id_supplier:0}]);

  const [photo, setPhoto] = useState(null);
  const [data, setData] = useState({
    name: '',
    cost: '',
    lowest_price: '',
    list_price: '',
    fk_supplier: proveedor.id_supplier
  });

  /* const handleName = ({ target: { value } }) => { setNameProduct(value)};
  const handleCost = ({ target: { value } }) => { SetCostProduct(parseInt(value))};
  const handlePUnit = (e) => {setPUnit(e.target.value)}
  const handlePMayor = (e) =>{setPMayor(e.target.value)} */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };
  const handleInputFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  const handleInputNumberChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: parseInt(value)
    });
  };
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // console.log(photo);
    // formData.append('photo', photo);
    console.log(data);
    formData.append('name', data.name);
    formData.append('cost', data.cost);
    formData.append('unit', data.unit);
    formData.append('total', data.total);
    formData.append('fk_supplier', data.fk_supplier);

    formData.append('photo', photo);

    

    console.log(formData);

    try {
      //console.log(formData.getAll('photo'));
      const response = await axios.post('http://localhost:3000/api/v1/products', formData, {
        
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  };



  const handleButton = async () => {
    const body = {proveedor,nameProduct,costProduct,PUnit,pMayor}
    const petition =  service.create(urlBase, body)
   }

  return (
    <>
    <form onSubmit={handleSubmit2} encType='multipart/form-data'>
    <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={setProveedor} place="Buscar Proveedor"/>
       
      <InputSimple titulo="Nombre" tipo="text" func={handleInputChange} nombre='name' callToAction="Escribe un nombre único"></InputSimple>
      <InputSimple titulo="Costo S/." tipo="number" func={handleInputNumberChange} nombre='cost'></InputSimple>
      <InputSimple titulo="P. Unit S/." tipo="number" func={handleInputNumberChange} nombre='unit'></InputSimple>
      <InputSimple titulo="Cargar Archivo" tipo="file" func={handleInputFileChange} nombre='unit'></InputSimple>

      <InputSimple titulo="P. Mayor S/." tipo="number" func={handleInputNumberChange} nombre='total'></InputSimple>
      <ParrafoInput titulo={'Proveedor'} parrafo={proveedor.name}/>
      <button type="submit">Upload</button>
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
