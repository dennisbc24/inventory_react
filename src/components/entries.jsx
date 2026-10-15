import { useState, useEffect } from "react";
import {  InputSimple,  SelectSimple,  ParrafoInput} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import "./css/proforma.css";
import "./css/compactForm.css";
import { TitleForm} from "./form/titleForm.jsx";
import { TableGet, TABLE_HEADERS } from "./table.jsx";
import { ExistenceEditableTable } from "./ExistenceEditableTable.jsx";
import { GuideModal, BRANCH_NAMES, USER_NAMES, genGuideCode } from "./guideModal.jsx";
import { todayPeru } from "../utils/date.js";
import noImagen from "./img/no_imagen.png";
import { InventoryService } from "../services/inventory.js";
const inventoryService = new InventoryService()
import { ProductService } from "../services/product.js";
const productService = new ProductService()

const num = (v) => parseFloat(v || 0);

export const EntriesForm = ({urlBase}) => {
const urlApiProducts = `${urlBase}/api/v1/products`;
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [idUser, setIdUser] = useState(1);
  const [idBranch, setIdBranch] = useState(1);
  const [idProduct, setId_Product] = useState(1);
  const [show, setShow] = useState(false)
  const [suppliers, setSuppliers] = useState([]);
  const [guideLines, setGuideLines] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [guideCode, setGuideCode] = useState("");
  const [entriesKey, setEntriesKey] = useState(0);

  useEffect(() => {
    // Simula la carga de todos los productos al inicio
    const fetchAllProducts = async () => {
      try {
        const [rp, rs] = await Promise.all([
          axios.get(urlApiProducts),
          axios.get(`${urlBase}/api/v1/suppliers`)
        ]);
        setAllProducts(rp.data);
        setSuppliers(Array.isArray(rs.data) ? rs.data : []);
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
  const handleChangeProducts = (e) => {setQuery(e.target.value), setShow(false)}
  const handleIdUser = (e) =>{  setIdUser(parseInt(e.target.value))}
  const handleIdBranch = (e) =>{  setIdBranch(parseInt(e.target.value))}
  

  const handleSearchProducts = (event) => { 
    const textoLi = event.target.textContent
      allProducts.forEach((elem) => {
        if (elem.name == textoLi) {
          setSuggestions([]);
          setProduct(elem);
          setId_Product(elem.id_product)
          setShow(true)
          setQuery('')
        }
      });
    };
    
const addToGuide = () => {
  if (count > 0 && idProduct) {
    if (guideLines.some((l) => l.product.id_product === idProduct)) {
      alert('Ese producto ya está en la guía');
      return;
    }
    const line = {
      key: `${idProduct}-${Date.now()}`,
      product: { id_product: idProduct, name: product.name, url_image: product.url_image, cost: product.cost, stock_total: product.stock_total, list_price: product.list_price, lowest_price: product.lowest_price, fk_category: product.fk_category, is_online: product.is_online, attributes: product.attributes, fk_supplier: product.fk_supplier },
      count,
      cost: product.cost ?? 0,
      fk_supplier: product.fk_supplier ?? ''
    };
    setGuideLines((prev) => [...prev, line]);
    setQuery(''); setSuggestions([]); setProduct([]); setId_Product(1); setCount(0); setShow(false);
    const inp = document.querySelector('input[placeholder="Buscar producto..."]'); if (inp) inp.value = '';
  } else {
    if (!(count > 0)) {
      alert('La cantidad debe ser mayor que cero');
    }
    if (!idProduct) {
      alert('Busca y selecciona un producto');
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

const updateGuideSupplier = (key, value) => {
  setGuideLines((prev) => prev.map((l) => (l.key === key ? { ...l, fk_supplier: value } : l)));
};

const updateGuideCost = (key, value) => {
  setGuideLines((prev) => prev.map((l) => (l.key === key ? { ...l, cost: value } : l)));
};

const supplierNameOf = (fk) => {
  if (fk === '' || fk === null || fk === undefined) return '';
  const s = suppliers.find((x) => String(x.id_supplier) === String(fk));
  return s ? s.name : '';
};

const openGuide = () => {
  setGuideCode(genGuideCode('GI'));
  setShowGuide(true);
};

const saveGuide = async () => {
  if (isSaving) return;
  for (const l of guideLines) {
    if (!(parseInt(l.count) > 0)) {
      alert(`Cantidad inválida para ${l.product.name}`);
      return;
    }
    if (!(num(l.cost) >= 0)) {
      alert(`Costo inválido para ${l.product.name}`);
      return;
    }
  }
  setIsSaving(true);
  // stock/costo base acumulados por producto para promediar líneas repetidas
  const stockMap = {};
  try {
    for (const l of guideLines) {
      const id = l.product.id_product;
      if (!stockMap[id]) {
        stockMap[id] = { qty: num(l.product.stock_total), cost: num(l.product.cost) };
      }
      const base = stockMap[id];
      const qty = parseInt(l.count);
      const lineCost = num(l.cost);
      const totalQty = base.qty + qty;
      const newCost = totalQty > 0
        ? parseFloat(((base.qty * base.cost + qty * lineCost) / totalQty).toFixed(2))
        : lineCost;
      await inventoryService.registerEntries(urlBase, { idBranch, count: qty, idUser, idProduct: id });
      await productService.updateCostAndSupplier(urlBase, l.product, {
        cost: newCost,
        fk_supplier: l.fk_supplier === '' ? null : l.fk_supplier,
        supplier: supplierNameOf(l.fk_supplier)
      });
      stockMap[id] = { qty: totalQty, cost: newCost };
    }
    setGuideLines([]);
    setShowGuide(false);
    alert('Guía de ingreso registrada con éxito (costos promediados)');
    setEntriesKey((k) => k + 1);
    const rp = await axios.get(urlApiProducts);
    setAllProducts(rp.data);
  } catch (innerError) {
    console.error("Error al registrar el ingreso:", innerError);
    alert('No se pudo registrar el ingreso');
  } finally {
    setIsSaving(false);
  }
};

const guideQty = guideLines.reduce((a, l) => a + (parseInt(l.count) || 0), 0);
  

  return (
    <><main>
<TitleForm text='Ingreso de Producto'></TitleForm>
      <input type="text"  value={query} onChange={handleChangeProducts} placeholder="Buscar producto..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
          <li key={index} onClick={handleSearchProducts}>
            {suggestion}
         </li>
        ))}
      </ul>
      

      <div className="divForm">
        <ParrafoInput titulo="Producto" parrafo={product.name} clase="parrafoForm compact"></ParrafoInput>
        <SelectSimple titulo="Sucursal"func={handleIdBranch} className="compact">
          <option value="1">B17</option>
          <option value="3">Departamento</option>
          <option value="7">Tambopata</option>
          <option value="4">Deposito</option>
          <option value="5">Los Nogales</option>
          <option value="6">Los Incas</option>
        </SelectSimple>
        <img className="product_image" src={product.url_image ? product.url_image : noImagen} ></img>

        <SelectSimple titulo="Usuario" func={handleIdUser} className="compact">
          <option value="1">Dennis</option>
          <option value="2">Luz</option>
          <option value="3">Miguel</option>
        </SelectSimple>
        <InputSimple titulo="Cantidad" tipo="number" func={handleCount} callToAction="Cuantos ingresan?" className="compact"></InputSimple>
      </div>
      <div className="form_actions">
        <button className="btn_primary" onClick={addToGuide}>Agregar a guía</button>
        <button className="btn_clear" onClick={() => { setQuery(''); setSuggestions([]); setProduct([]); setId_Product(1); setCount(0); setShow(false); const inp = document.querySelector('input[placeholder="Buscar producto..."]'); if (inp) inp.value = ''; }}>Limpiar</button>
      </div>
    </main>

      {guideLines.length > 0 && (
        <button className="proforma_float" onClick={openGuide}>
          <span className="proforma_icon">📥</span>
          <span>{guideQty} uds.</span>
          <span className="proforma_count">{guideLines.length}</span>
        </button>
      )}
      {showGuide && (
        <GuideModal
          title="GUÍA DE INGRESO"
          code={guideCode}
          header={[["Fecha", todayPeru().split("-").reverse().join("/")], ["Sucursal", BRANCH_NAMES[idBranch] || idBranch], ["Usuario", USER_NAMES[idUser] || idUser]]}
          lines={guideLines}
          onQty={updateGuideQty}
          onRemove={removeGuideLine}
          totalLabel="Total unidades"
          onSave={saveGuide}
          saving={isSaving}
          onClose={() => setShowGuide(false)}
          suppliers={suppliers}
          onSupplier={updateGuideSupplier}
          onCost={updateGuideCost}
        />
      )}
    
      
      {<>{ show ? <ExistenceEditableTable url={`${urlBase}/api/v1/existence?product=${idProduct}`}/> : <></>
    }</>}
      
      <h3>Ultimos Ingresos</h3>
      <TableGet key={entriesKey} url={`${urlBase}/api/v1/entries`} minWitdh="735px" headers={TABLE_HEADERS.entries}/>
    </>
  );
}
