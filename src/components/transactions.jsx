import  { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import "./css/transactions.css";
import "./css/proforma.css";
import "./css/compactForm.css";
import { InventoryService } from "../services/inventory.js";
const inventoryService = new InventoryService()
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet, TABLE_HEADERS } from "./table.jsx";
import { GuideModal, BRANCH_NAMES, USER_NAMES, genGuideCode } from "./guideModal.jsx";
import { ExistenceEditableTable } from "./ExistenceEditableTable.jsx";
import noImagen from "./img/no_imagen.png";
import entregaImagen from "./icons/entrega.png";

export const TransactionsForm = ({urlBase}) => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [idUser, setIdUser] = useState(1);
  const [dateTrans, setDateTrans] = useState('');
  const [branchA, setBranchA] = useState(1);
  const [branchB, setBranchB] = useState(1);
  const [show, setShow] = useState(true)
  const [showStock, setShowStock] = useState(false)
  const [guideLines, setGuideLines] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [guideCode, setGuideCode] = useState("");
  const [savingGuide, setSavingGuide] = useState(false);
  const [transKey, setTransKey] = useState(0);

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


  const handleCount = ({ target: { value } }) => { setCount(parseInt(value))};
  const handleChange = (e) => {setQuery(e.target.value), setShow(false), setShowStock(false)}
  const handleDate = (e) =>{setDateTrans(e.target.value)}
  const handleIdUser = (e) =>{  setIdUser(parseInt(e.target.value))}
  const handleIdBranchA = (e) =>{  setBranchA(parseInt(e.target.value))}
  const handleIdBranchB = (e) =>{  setBranchB(parseInt(e.target.value))}
  const handleClick = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setShowStock(true)
          setQuery('')
        }
      });
    };


  const addToGuide = () => {
    if (dateTrans != '' && branchA !== branchB && count > 0 && product.id_product != undefined) {
      if (guideLines.some((l) => l.product.id_product === product.id_product)) {
        alert('Ese producto ya está en la guía');
        return;
      }
      const line = {
        key: `${product.id_product}-${Date.now()}`,
        product: { id_product: product.id_product, name: product.name, url_image: product.url_image },
        count
      };
      setGuideLines((prev) => [...prev, line]);
      setQuery(''); setSuggestions([]); setProduct([]); setCount(0); setShowStock(false);
      const countEl = document.querySelector('input[placeholder="Cuantos?"]'); if (countEl) countEl.value = '';
    } else {
      if (dateTrans == '') {
        alert('Debes seleccionar una fecha')
      } if (branchA === branchB) {
        alert('El origen y el destino es el mismo')
      } if (count < 1) {
        alert('la cantidad es menor de 1')
      } if (product.id_product === undefined) {
        alert('selecciona un producto')
      }
    }
  };

  const updateGuideQty = (key, delta) => {
    setGuideLines((prev) => prev.map((l) =>
      l.key === key ? { ...l, count: Math.max(1, l.count + delta) } : l
    ));
  };

  const removeGuideLine = (key) => {
    setGuideLines((prev) => prev.filter((l) => l.key !== key));
  };

  const openGuide = () => {
    setGuideCode(genGuideCode('GT'));
    setShowGuide(true);
  };

  const saveGuide = async () => {
    if (dateTrans == '' || branchA === branchB) {
      alert('Revisa fecha, origen y destino de la guía');
      return;
    }
    for (const l of guideLines) {
      if (!(parseInt(l.count) > 0)) {
        alert(`Cantidad inválida para ${l.product.name}`);
        return;
      }
    }
    setSavingGuide(true);
    try {
      for (const l of guideLines) {
        await inventoryService.registerTransaction(urlBase, {
          branchA, branchB, count: parseInt(l.count), idUser, dateTrans, id_product: l.product.id_product
        });
      }
      setGuideLines([]);
      setShowGuide(false);
      alert('Guía de traslado registrada con éxito');
      setTransKey((k) => k + 1);
    } catch (e) {
      console.error(e);
      alert('Error al registrar traslado');
    } finally {
      setSavingGuide(false);
    }
  };

  const guideQty = guideLines.reduce((a, l) => a + (parseInt(l.count) || 0), 0);
  return (
    <>
    <main>
<TitleForm text='Traslado de Mercaderia'></TitleForm>
      

      <div className="divForm">
      <input type="text"  value={query} onChange={handleChange} placeholder="Buscar producto..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleClick}>
            {suggestion}
         </li>
        ))}
      </ul>
        <p>{product.name}</p>
        
        <img className="product_image" src={product.url_image ? product.url_image : noImagen} ></img>
        <div className="inputSimple compact"><h3>Fecha</h3><input type="date" name="fecha" onChange={handleDate} /></div>

        <div className="small_box_transaction">

        <SelectSimple titulo="Desde"func={handleIdBranchA} className="compact">
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <img src={entregaImagen} alt="delivery car image" />
        <SelectSimple titulo="Hacia"func={handleIdBranchB} className="compact">
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        </div>
        <div className="small_box_transaction">
        <SelectSimple titulo="Usuario" func={handleIdUser} className="compact">
          <option value="1">Dennis</option>
          <option value="2">Luz</option>
          <option value="3">Miguel</option>
        </SelectSimple>

        <InputSimple titulo="Cantidad"  tipo="number" func={handleCount} callToAction="Cuantos?" widthInput="70px" className="compact"></InputSimple>
        
        </div>
        
      </div>
      <div className="form_actions">
        <button className="btn_primary" onClick={addToGuide}>Agregar a guía</button>
        <button className="btn_clear" onClick={() => { setQuery(''); setSuggestions([]); setProduct([]); setCount(0); setShowStock(false); setDateTrans(''); const fe = document.querySelector('input[name="fecha"]'); if (fe) fe.value = ''; }}>Limpiar</button>
      </div>
    </main>

      {guideLines.length > 0 && (
        <button className="proforma_float" onClick={openGuide}>
          <span className="proforma_icon">🚚</span>
          <span>{guideQty} uds.</span>
          <span className="proforma_count">{guideLines.length}</span>
        </button>
      )}
      {showGuide && (
        <GuideModal
          title="GUÍA DE TRASLADO"
          code={guideCode}
          header={[["Fecha", dateTrans], ["Desde", BRANCH_NAMES[branchA] || branchA], ["Hacia", BRANCH_NAMES[branchB] || branchB], ["Usuario", USER_NAMES[idUser] || idUser]]}
          lines={guideLines}
          onQty={updateGuideQty}
          onRemove={removeGuideLine}
          totalLabel="Total unidades"
          onSave={saveGuide}
          saving={savingGuide}
          onClose={() => setShowGuide(false)}
        />
      )}
    
      <h3>Stock {product?.name ? `- ${product.name}` : ''} {product?.id_product && <span style={{fontSize:12,color:'#888'}}>(doble click admin para editar)</span>}</h3>
      {<>{ showStock ? <ExistenceEditableTable url={`${urlBase}/api/v1/existence?product=${product.id_product}`}/> : <></>
    }</>}
      <h3>Ultimas Movimientos</h3>
      {<>{ show ? <TableGet key={transKey} url={`${urlBase}/api/v1/transactions`} minWitdh="860px" headers={TABLE_HEADERS.transactions}/> : <></>
    }</>}
      
    </>
  );
};
