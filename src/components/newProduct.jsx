import { useContext, useState } from "react";
import {  InputSimple, ParrafoInput, SearchInput} from "./form/inputSearch";
import { AttributesEditor } from "./form/AttributesEditor.jsx";
import imageCompression from "browser-image-compression";
import "./salesForm.css";
import "./css/newProduct.css";
import "./css/compactForm.css";
import axios from 'axios';
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet, TABLE_HEADERS } from "./table.jsx";
import { ContextUser } from "../context/userContext.jsx";

const BRANCHES = [
  { id: 1, name: "B17" },
  { id: 3, name: "Departamento" },
  { id: 4, name: "Deposito" },
  { id: 5, name: "Los Nogales" },
  { id: 6, name: "Los Incas" },
  { id: 7, name: "Tambopata" }
];

export const NewProduct = ({urlBase}) => {
  const { idUser } = useContext(ContextUser);
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0.00);
  const [lowest_price, setLowest_price] = useState(0.00);
  const [list_price, setList_price] = useState(0.00);
  const [proveedor, setProveedor] = useState([{name:'',id_supplier:0}]);
  const [categoria, setCategoria] = useState({name:'',id_category:0});
  const [isOnline, setIsOnline] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [stockRows, setStockRows] = useState([]);

  const [photo, setPhoto] = useState(null);
  const [fileKey, setFileKey] = useState(0);
 
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
 
  const handleClear = () => {
    setName(''); setCost(0); setLowest_price(0); setList_price(0);
    setProveedor([{name:'',id_supplier:0}]); setCategoria({name:'',id_category:0});
    setIsOnline(false); setAttributes({}); setPhoto(null); setFileKey(k=>k+1);
    setStockRows([]);
    const form = document.querySelector('form'); if(form) form.reset();
  };

  const updateStockRow = (i, field, value) => {
    setStockRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };
  const addStockRow = () => setStockRows(rows => [...rows, { fk_branch: 1, amount: 1 }]);
  const removeStockRow = (i) => setStockRows(rows => rows.filter((_, idx) => idx !== i));

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
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
    formData.append('attributes', JSON.stringify(attributes));
    formData.append('photo', photo);
    formData.append('stock', JSON.stringify(stockRows.filter(r => Number(r.amount) > 0)));
    formData.append('fk_user', idUser || '');

    try {
      const urlPost = `${urlBase}/api/v1/products/`
      const response = await axios.post(urlPost, formData, {});
      alert(`Producto con el nombre ${name} ha sido creado`)
      // limpiar formulario y archivo
      setName(''); setCost(0); setLowest_price(0); setList_price(0);
      setProveedor([{name:'',id_supplier:0}]); setCategoria({name:'',id_category:0});
      setIsOnline(false); setAttributes({}); setPhoto(null); setFileKey(k=>k+1);
      setStockRows([]);
      // reset inputs no controlados
      const form = document.querySelector('form'); if(form) form.reset();
    } catch (error) {
      console.error('Error uploading the file:', error);
      alert(error?.response?.data?.message || 'Error al crear producto');
    }
  };

  return (
    <>
    <main>
      <TitleForm text='Crear Nuevo Producto'></TitleForm>
<form onSubmit={handleSubmit2} encType='multipart/form-data' className='new_product_form'>
    <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={setProveedor} place="Buscar Proveedor"/>
    <SearchInput urlApi={`${urlBase}/api/v1/categories`} funcSet={setCategoria} place="Buscar Categoría"/>
       
      <InputSimple titulo="Nombre" tipo="text" func={handleName} nombre='name' callToAction="Escribe un nombre único" className="compact"></InputSimple>
      <InputSimple titulo="Costo S/." tipo="number" step="any" func={handleCost} nombre='cost' className="compact"></InputSimple>
      <InputSimple titulo="P. Unit S/." tipo="number" step="any" func={handlePUnit} nombre='unit' className="compact"></InputSimple>
      <InputSimple titulo="P. Mayor S/." tipo="number" step="any" func={handlePMayor} nombre='total' className="compact"></InputSimple>
      <InputSimple key={fileKey} titulo="Cargar Archivo" tipo="file" func={handleInputFileChange} nombre='photo' className="compact"></InputSimple>
      <div className='inputSimple compact'>
        <h3>Venta online</h3>
        <label style={{display:'flex',gap:8,alignItems:'center'}}>
          <input type="checkbox" checked={isOnline} onChange={e=>setIsOnline(e.target.checked)} /> Habilitar para ecommerce
        </label>
      </div>
      {isOnline && <AttributesEditor value={attributes} onChange={setAttributes} />}

      <div className="np_stock">
        <h3>Stock inicial por sucursal (opcional)</h3>
        {stockRows.map((row, i) => (
          <div className="np_stock_row" key={i}>
            <select value={row.fk_branch} onChange={e => updateStockRow(i, 'fk_branch', Number(e.target.value))}>
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input type="number" min="1" step="1" placeholder="Cantidad" value={row.amount} onChange={e => updateStockRow(i, 'amount', e.target.value)} />
            <button type="button" className="np_remove" onClick={() => removeStockRow(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="np_add_row" onClick={addStockRow}>+ Agregar sucursal</button>
      </div>

      <ParrafoInput titulo={'Proveedor'} parrafo={proveedor.name} clase="parrafoForm compact"/>
      <ParrafoInput titulo={'Categoría'} parrafo={categoria.name} clase="parrafoForm compact"/>
      <ParrafoInput titulo={'Online'} parrafo={isOnline ? 'Sí - visible en shop' : 'No'} clase="parrafoForm compact"/>
      <div className="form_actions">
        <button type="submit" className="btn_primary">Crear Producto</button>
        <button type="button" className="btn_clear" onClick={handleClear}>Limpiar</button>
      </div>
    </form>
    
    </main>
    
      <div className="divForm">
        {/* <UploadPhoto></UploadPhoto> */}
        
        {/* <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={setProveedor} place="Buscar Proveedor"/> */}
        
        
      </div>
      {/* <ButtonSave titulo={"Crear"} func={handleButton}/> */}
      <h3>Ultimos Creados</h3>
      <TableGet url={`${urlBase}/api/v1/products/latestproducts`} headers={TABLE_HEADERS.products}/>
    </>
  );
};

