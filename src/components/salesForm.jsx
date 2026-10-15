import { useState, useEffect, useContext } from "react";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { ButtonSave } from "./form/inputSearch";
import { TableGet, TABLE_HEADERS } from "./table.jsx";
import { ExistenceEditableTable } from "./ExistenceEditableTable.jsx";
import axios from "axios";
import { SalesService } from "../services/sales.js";
import { PopUpWindow } from "../../src/components/form/popupwindow.jsx";
import { ProformaModal } from "./proforma.jsx";
import { todayPeru } from "../utils/date.js";
import noImagen from "./img/no_imagen.png";
const saleService = new SalesService()
import { ContextGlobal  } from "../context/globalContext.jsx";
import { ContextUser } from "../context/userContext.jsx";
import useFetch from "../hooks/useFetch.jsx";
import shoppingService from "../services/shoppingList";
export const SelesForm = ({ urlBase }) => {

  const {setProductGlobal, productGlobal, closeWindow, setCloseWindow, urlGlobal} = useContext(ContextGlobal)
  const { usuario } = useContext(ContextUser)
  
  const [inShoppingList, setInShoppingList] = useState(false);
  const [shoppingItemId, setShoppingItemId] = useState(null);
  

  const [query, setQuery] = useState("");
  // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [count, setCount] = useState(1);
  const [cost, setCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [PUnit, setPUnit] = useState(0);
  const [proforma, setProforma] = useState([]);
  const [showProforma, setShowProforma] = useState(false);
  const [proformaCliente, setProformaCliente] = useState('');
  const [proformaFecha, setProformaFecha] = useState(todayPeru());
  const [savingProforma, setSavingProforma] = useState(false);
  const [salesKey, setSalesKey] = useState(0);
  const [idUser, setIdUser] = useState(1);
  const [idBranch, setIdBranch] = useState(1);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const [showMoreBranches, setShowMoreBranches] = useState(false);
  const [show, setShow] = useState(false)
  const [showSales, SetShowSales] = useState(true)
  const [urlImage, setUrlImage] = useState(noImagen);
  const [revenueEditing, setRevenueEditing] = useState(undefined);
  const [costEditing, setCostEditing] = useState(undefined);
  const [isOnline, setIsOnline] = useState(false);
  //const [editImg, setEditImg] = useState(false)

const handleChangeRevenue = (e) => {
  setRevenueEditing(e.target.value);
}

const commitRevenue = () => {
  const val = parseFloat(revenueEditing);
  if (isNaN(val)) { setRevenueEditing(undefined); return; }
  // sobrescribe ganancia y recalcula PUnit/total para que el form refleje el override
  setRevenue(val.toFixed(2));
  if (count > 0) {
    const newPUnit = (val / count) + Number(cost || 0);
    setPUnit(newPUnit);
    setTotal(newPUnit * count);
  }
  setRevenueEditing(undefined);
};

const handleRevenueBlur = () => commitRevenue();
const handleRevenueKey = (e) => {
  if (e.key === 'Enter') commitRevenue();
  if (e.key === 'Escape') setRevenueEditing(undefined);
};

const commitCost = () => {
  const val = parseFloat(costEditing);
  if (isNaN(val) || val < 0) { setCostEditing(undefined); return; }
  setCost(val);
  setCostEditing(undefined);
  // revenue se recalcula vía useEffect [PUnit,cost]
};

const handleCostBlur = () => commitCost();
const handleCostKey = (e) => {
  if (e.key === 'Enter') commitCost();
  if (e.key === 'Escape') setCostEditing(undefined);
};

// seleccionar dato para editar
  const handleDoubleClick = (rvn) => {
    setRevenueEditing(String(rvn));
  };
  const handleDoubleClickCost = (c) => {
    setCostEditing(String(c));
  };

    let lastTapTime = 0;

  const handleDoubleTap = () => { // open popup window
    const currentTime = Date.now();
    const tapInterval = currentTime - lastTapTime;
    if (tapInterval < 300 && tapInterval > 0) { // Detecta doble toque en menos de 300 ms
      setCloseWindow(closeWindow ? false : true)
    }
    lastTapTime = currentTime;
  };

  const { data: products } = useFetch(`${urlGlobal}/api/v1/products`);

  // hidrata costo/imagen/online al volver a la vista con productGlobal ya seteado
  useEffect(() => {
    if (productGlobal?.id_product) {
      if (productGlobal.cost !== undefined) setCost(productGlobal.cost);
      setIsOnline(!!productGlobal.is_online);
      setUrlImage(productGlobal.url_image || noImagen);
      setShow(true);
    }
  }, [productGlobal]);

  useEffect(() => { // search suggestions
    if (products) {
      // Filtra los nombres localmente en base a la query
    const filteredNames = products
    .filter((product) =>
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
    }
    
  }, [query, products]);

  useEffect(() => {
    setPUnit(total / count);
  }, [count, total]);

  useEffect(() => {
    // no sobrescribas si el usuario está editando ganancia manualmente
    if (revenueEditing !== undefined) return;
    const value = ((PUnit - cost) * count).toFixed(2)
    setRevenue(value)
  }, [PUnit, cost, revenueEditing]);

  useEffect(() => {
    let isActive = true;
    const checkShoppingList = async () => {
      if (usuario.role === 'admin' && productGlobal && productGlobal.id_product) {
        try {
          const response = await shoppingService.checkProduct(urlGlobal, productGlobal.id_product);
          if (isActive) {
            setInShoppingList(response.inList);
            setShoppingItemId(response.id_shopping);
          }
        } catch (error) {
          console.error("Error al consultar la lista de compras:", error);
        }
      } else {
        setInShoppingList(false);
        setShoppingItemId(null);
      }
    };
    checkShoppingList();
    return () => { isActive = false; };
  }, [productGlobal, urlGlobal, usuario.role]);

  const toggleShoppingList = async () => {
    if (!productGlobal || !productGlobal.id_product) return;
    try {
      if (inShoppingList) {
        if (shoppingItemId) {
          await shoppingService.remove(urlGlobal, shoppingItemId);
        }
        setInShoppingList(false);
        setShoppingItemId(null);
      } else {
        const response = await shoppingService.addManual(urlGlobal, productGlobal.id_product);
        setInShoppingList(true);
        setShoppingItemId(response.id_shopping);
      }
    } catch (error) {
      console.error("Error al modificar la lista de compras:", error);
    }
  };

  const handleCount = ({ target: { value } }) => { setCount(parseInt(value)) };
  const handleTotal = ({ target: { value } }) => { setTotal(parseFloat(value)) };
  const handleChange = (e) => { setQuery(e.target.value), setShow(false), SetShowSales(false) }

   const handleIdUser = (e) => {
     const value = parseInt(e.target.value)
    setIdUser(value)

   }

  const handleIdBranch = (e) => {
     const value = parseInt(e.target.value)
     setIdBranch(value)
  
   }


    const handleClick = (event) => {
    const textoLi = event.target.textContent
    products.forEach((elem) => {
      if (elem.name == textoLi) {
        setSuggestions([]);
        setProductGlobal(elem)
        setCost(elem.cost);
        setIsOnline(!!elem.is_online);
        setQuery('')
        setShow(true)
        elem.url_image ? setUrlImage(elem.url_image) : setUrlImage(noImagen)
      }
    });
  };

  const toggleOnline = async (e) => {
    const val = e.target.checked;
    if (!productGlobal?.id_product) return;
    setIsOnline(val);
    try {
      const fd = new FormData();
      fd.append('name', productGlobal.name);
      fd.append('cost', productGlobal.cost ?? 0);
      fd.append('sugested_price', productGlobal.list_price ?? 0);
      fd.append('wholesale_price', productGlobal.lowest_price ?? 0);
      fd.append('fk_category', productGlobal.fk_category || '');
      fd.append('is_online', val ? 'true' : 'false');
      await axios.patch(`${urlBase}/api/v1/products/${productGlobal.id_product}`, fd);
      setProductGlobal({ ...productGlobal, is_online: val });
    } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message); setIsOnline(!val); }
  };


  const addToProforma = () => {
    if (!productGlobal || productGlobal.id_product === undefined) {
      alert('la selección del producto es incorrecta');
      return;
    }
    if (!(count > 0)) {
      alert('Cantidad debe ser mayor que cero');
      return;
    }
    const pUnit = parseFloat(PUnit) || 0;
    const lineRevenue = parseFloat(((pUnit - cost) * count).toFixed(2));
    if (lineRevenue < 0) {
      alert('Esta venta es a perdida, por lo cual no se puede agregar!');
      return;
    }
    const line = {
      key: `${productGlobal.id_product}-${idBranch}-${pUnit}`,
      product: { id_product: productGlobal.id_product, name: productGlobal.name, url_image: productGlobal.url_image },
      count,
      pUnit,
      cost: parseFloat(cost) || 0,
      idUser,
      idBranch
    };
    setProforma((prev) => {
      const idx = prev.findIndex((l) => l.key === line.key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], count: next[idx].count + count };
        return next;
      }
      return [...prev, line];
    });
    // limpiar selección para el siguiente producto (se conserva usuario/sucursal)
    setQuery(''); setSuggestions([]); setProductGlobal({}); setCost(0); setTotal(0); setRevenue(0); setPUnit(0); setCount(1); setShow(false); setUrlImage(noImagen); setIsOnline(false); setRevenueEditing(undefined); setCostEditing(undefined);
    document.querySelectorAll('.descriptionSell input[type="number"]').forEach(el => { el.value = ""; });
  };

  const updateProformaQty = (key, delta) => {
    setProforma((prev) => prev.map((l) =>
      l.key === key ? { ...l, count: Math.max(1, l.count + delta) } : l
    ));
  };

  const updateProformaPrice = (key, value) => {
    setProforma((prev) => prev.map((l) =>
      l.key === key ? { ...l, pUnit: value === "" ? "" : parseFloat(value) || 0 } : l
    ));
  };

  const removeProformaLine = (key) => {
    setProforma((prev) => prev.filter((l) => l.key !== key));
  };

  const saveProforma = async () => {
    if (!proformaFecha) {
      alert('Selecciona la fecha de la venta!');
      return;
    }
    for (const l of proforma) {
      const pUnit = parseFloat(l.pUnit);
      if (!(l.count > 0)) {
        alert(`Cantidad inválida para ${l.product.name}`);
        return;
      }
      if (!(pUnit > 0)) {
        alert(`Precio inválido para ${l.product.name}`);
        return;
      }
      const rev = parseFloat(((pUnit - l.cost) * l.count).toFixed(2));
      if (rev < 0) {
        alert(`La línea ${l.product.name} es a perdida, por lo cual no se puede registrar!`);
        return;
      }
    }
    setSavingProforma(true);
    try {
      for (const l of proforma) {
        const pUnit = parseFloat(l.pUnit);
        await saleService.register(urlBase, {
          dateSell: proformaFecha,
          count: l.count,
          total: parseFloat((pUnit * l.count).toFixed(2)),
          PUnit: pUnit,
          revenue: parseFloat(((pUnit - l.cost) * l.count).toFixed(2)),
          dataCustomer: proformaCliente,
          product: l.product,
          idUser: l.idUser,
          idBranch: l.idBranch
        });
      }
      setProforma([]);
      setShowProforma(false);
      setProformaCliente('');
      alert('Felicidades...Venta Registrada!');
      SetShowSales(true);
      setSalesKey((k) => k + 1);
    } catch (e) {
      console.error(e);
      alert('Error al registrar venta');
    } finally {
      setSavingProforma(false);
    }
  };

  const proformaTotal = proforma.reduce((a, l) => a + (parseFloat(l.pUnit || 0) * l.count), 0);
  const proformaCount = proforma.reduce((a, l) => a + l.count, 0);

  const handleDirectSave = async () => {
    if (!productGlobal || productGlobal.id_product === undefined) {
      alert('la selección del producto es incorrecta');
      return;
    }
    if (!(count > 0)) {
      alert('Cantidad debe ser mayor que cero');
      return;
    }
    const rev = parseFloat(revenue);
    if (!(rev > 0)) {
      alert('La ganancia debe ser mayor a 0 para registrar!');
      return;
    }
    try {
      await saleService.register(urlBase, {
        dateSell: todayPeru(),
        count, total, PUnit, revenue: rev, dataCustomer: '',
        product: productGlobal, idUser, idBranch
      });
      SetShowSales(true);
      setSalesKey((k) => k + 1);
      alert('Felicidades...Venta Registrada!');
      setQuery(''); setSuggestions([]); setProductGlobal({}); setCost(0); setTotal(0); setRevenue(0); setPUnit(0); setCount(1); setShow(false); setUrlImage(noImagen); setIsOnline(false); setRevenueEditing(undefined); setCostEditing(undefined);
      document.querySelectorAll('.descriptionSell input[type="number"]').forEach(el => { el.value = ""; });
    } catch (e) {
      console.error(e);
      alert('Error al registrar venta');
    }
  };

  return (
    <>
    <main style={{ padding: 16 }}>
      <div className="sell_topbar">
        <TitleForm text='Registrar Venta'></TitleForm>
        <button onClick={handleDirectSave} className="saveSell">Guardar directo</button>
      </div>
      {closeWindow ? <PopUpWindow text='Actualizar Imagen'></PopUpWindow> : <></>}
      <input type="text" className="only_input" value={query} onChange={handleChange} placeholder="Buscar..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
        <li key={index} onClick={handleClick}>
          {suggestion}
        </li>
      ))}
      </ul>

      <div className="divForm">
        <div className="inputs_form">
        </div>
        <div className="inputs_form">
      </div>
  </div>

      <div className="descriptionSell">
      <div className="image_box">
      <img className="product_image" src={productGlobal.url_image ? productGlobal.url_image : urlImage} onClick={handleDoubleTap}></img>

      </div>
      <div>
      
        <p>{productGlobal.name} </p>
        {productGlobal?.id_product && (
          <label style={{display:'flex',gap:6,alignItems:'center',margin:'6px 0',fontSize:13}}>
            <input type="checkbox" checked={isOnline} onChange={toggleOnline} disabled={usuario?.role!=='admin' && usuario?.user?.role!=='admin'} /> Venta online {isOnline ? '✅' : '❌'}
            {(usuario?.role!=='admin' && usuario?.user?.role!=='admin') && <span style={{fontSize:11,color:'#888'}}>(solo admin)</span>}
          </label>
        )}
        <div className="dataSell">
                  <h4>Cant</h4>
                  <input type="number" onChange={handleCount} style={{ 'width': '45px' }} />
                </div>
                <div className="dataSell">
                  <h4>P.T.</h4>
                  <input type="number" onChange={handleTotal} style={{ 'width': '45px' }} />
                </div>
                <p className="unitPrice">{`Precio Unitario: S/.${(PUnit).toFixed(2)}`}</p>       
      </div>
      </div>
      <div className="selectsBox" style={{gap:20}}>

      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        <h3>Usuario</h3>
        <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idUser===1} onChange={()=>setIdUser(1)} /> Dennis</label>
        <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idUser===2} onChange={()=>setIdUser(2)} /> Luz</label>
        {showMoreUsers && <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idUser===3} onChange={()=>setIdUser(3)} /> Miguel</label>}
        <button type="button" onClick={()=>setShowMoreUsers(v=>!v)} style={{fontSize:11,background:'none',border:'none',color:'#2962FF',cursor:'pointer',padding:0,textAlign:'left'}}>{showMoreUsers ? '▲ ver menos' : '••• ver más'}</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        <h3>Sucursal</h3>
        <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idBranch===1} onChange={()=>setIdBranch(1)} /> B17</label>
        <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idBranch===4} onChange={()=>setIdBranch(4)} /> Deposito</label>
        {showMoreBranches && <>
          <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idBranch===3} onChange={()=>setIdBranch(3)} /> Departamento</label>
          <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idBranch===7} onChange={()=>setIdBranch(7)} /> Tambopata</label>
          <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idBranch===5} onChange={()=>setIdBranch(5)} /> Los Nogales</label>
          <label style={{display:'flex',gap:6,alignItems:'center',fontSize:13}}><input type="checkbox" checked={idBranch===6} onChange={()=>setIdBranch(6)} /> Los Incas</label>
        </>}
        <button type="button" onClick={()=>setShowMoreBranches(v=>!v)} style={{fontSize:11,background:'none',border:'none',color:'#2962FF',cursor:'pointer',padding:0,textAlign:'left'}}>{showMoreBranches ? '▲ ver menos' : '••• ver más'}</button>
      </div>
      </div>
      <div className="summarySell">
        <p>{`Productos (${count}) x (${PUnit}): `}</p>
        <p>{`S/.${(total).toFixed(2)}`}</p>
        </div> 
        <div className="summarySell">
        <p>Ganancia:</p>
        <div onDoubleClick={() => handleDoubleClick(revenue)} title="Doble click para editar">
          {revenueEditing != undefined ? (
                  <input
                    type="number"
                    value={revenueEditing}
                    onChange={handleChangeRevenue}
                    onBlur={handleRevenueBlur}
                    onKeyDown={handleRevenueKey}
                    autoFocus
                  />
                ) : (
                  <p>{`S/.${revenue}`} <span style={{fontSize:10,color:'#aaa'}}>✎</span></p>
                )}
          
        </div>
        
        </div>       
        <div className="summarySell">
        <p>Costo:</p>
        <div onDoubleClick={() => handleDoubleClickCost(cost)} title="Doble click para editar">
          {costEditing !== undefined ? (
            <input type="number" value={costEditing} onChange={e=>setCostEditing(e.target.value)} onBlur={handleCostBlur} onKeyDown={handleCostKey} autoFocus />
          ) : (
            <p>{`S/.${cost}`} <span style={{fontSize:10,color:'#aaa'}}>✎</span></p>
          )}
        </div>
        </div>  
        <div className="summarySell">
        <p>Actualizado:</p>
        <p>{(productGlobal.updated ? (productGlobal.updated.slice(0, 10)) : productGlobal.updated)}</p>
        </div>  
      <div className="button_save_sell">
        <button onClick={addToProforma} className="saveSell">Agregar a proforma</button>
      </div>

      {proforma.length > 0 && (
        <button className="proforma_float" onClick={() => setShowProforma(true)}>
          <span className="proforma_icon">🧾</span>
          <span>S/.{proformaTotal.toFixed(2)}</span>
          <span className="proforma_count">{proformaCount}</span>
        </button>
      )}
      {showProforma && (
        <ProformaModal
          lines={proforma}
          cliente={proformaCliente}
          setCliente={setProformaCliente}
          fecha={proformaFecha}
          setFecha={setProformaFecha}
          onClose={() => setShowProforma(false)}
          onQty={updateProformaQty}
          onPrice={updateProformaPrice}
          onRemove={removeProformaLine}
          onSave={saveProforma}
          saving={savingProforma}
        />
      )}

      
      
    </main>
    <h3>Stock</h3>
      {usuario.role === 'admin' && productGlobal && productGlobal.id_product ? (
        <ButtonSave titulo={inShoppingList ? 'Quitar de lista de compras' : 'Agregar a lista de compras'} func={toggleShoppingList}/>
      ) : null}
      {<>{show ? <ExistenceEditableTable url={`${urlBase}/api/v1/existence?product=${productGlobal.id_product}`} /> : <></>
      }</>}
      <h3>Ultimas Ventas</h3>

      {<>{showSales ? <TableGet key={salesKey} url={`${urlBase}/api/v1/ventas`} headers={TABLE_HEADERS.sales} /> : <></>
      }</>}
    </>
  );
};
