import  { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import {  InputSimple, SearchInput} from "./form/inputSearch";
import "./salesForm.css";
import "./table.css";
import "./css/popupwindow.css";
import "./css/proforma.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet, TableGet2, TABLE_HEADERS } from "./table.jsx";
import { SalesService } from "../services/sales.js";
import { ContextUser } from "../context/userContext.jsx";
import noImagen from "./img/no_imagen.png";


const saleService = new SalesService()

const MOTIVOS = ["Producto fallado", "Producto equivocado", "Cliente arrepentido", "No era lo que pidió", "Error de registro"];
const BRANCH_NAMES = { 1: "B17", 3: "Departamento", 4: "Deposito", 5: "Los Nogales", 6: "Los Incas", 7: "Tambopata" };
const num = (v) => parseFloat(v || 0);

// normaliza claves por si el backend devuelve alias con distinta capitalización
const normRow = (r) => ({
    id_sale: r.id_sale,
    vendedor: r.vendedor ?? r.Vendedor ?? "",
    cant: r.cant ?? r.Cant ?? "",
    producto: r.producto ?? r.Producto ?? "",
    p_total: r.p_total,
    p_unit: r.p_unit,
    ganancia: r.ganancia ?? r.Ganancia ?? "",
    hora: r.hora ?? r.Hora ?? "",
    cliente: r.cliente ?? r.Cliente ?? "",
    fecha: r.fecha ?? r.Fecha ?? "",
    fk_product: r.fk_product,
    fk_id_user: r.fk_id_user,
    fk_id_branch: r.fk_id_branch
  });

const MotivoField = ({ motivo, setMotivo, custom, setCustom }) => (
  <div className="proforma_head">
    <label>Motivo:
      <select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
        <option value="">Seleccione motivo...</option>
        {MOTIVOS.map((m) => <option key={m} value={m}>{m}</option>)}
        <option value="OTRO">Otro (escribir)...</option>
      </select>
    </label>
    {motivo === "OTRO" && (
      <input type="text" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Escribe el motivo" />
    )}
  </div>
);

const motivoFinal = (motivo, custom) => (motivo === "OTRO" ? custom.trim() : motivo);

const SearchByProduct=({urlBase})=>{
     const [product, setProduct] = useState({name:'', id_product:0})
     const [data2, setData2] = useState([]);

     useEffect(()=>{
       if (product.id_product) getData();
     }, [product])

  const getData = async () => {

    const data = await saleService.getByProduct(urlBase,product.id_product)
    setData2(data || [])

  };


    return (
      <>
      <p>{product.name || 'Selecciona un producto...'}</p>
      <div className="divForm">
      <SearchInput urlApi={`${urlBase}/api/v1/products`} funcSet={setProduct} place="Buscar Producto"/>

      </div>

      {<>{ data2.length > 0 ? <TableGet2 respJson={data2} minWitdh="600px" headers={TABLE_HEADERS.saleByProduct}/> : <></>
      }</>}
      </>
    );
}

const SearchByDate= ({url}) => {
  
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState([]);
  const [devSale, setDevSale] = useState(null);
  const [motivoDev, setMotivoDev] = useState("");
  const [motivoDevCustom, setMotivoDevCustom] = useState("");
  const [cambioSale, setCambioSale] = useState(null);
  const [motivoCambio, setMotivoCambio] = useState("");
  const [motivoCambioCustom, setMotivoCambioCustom] = useState("");
  const [exProduct, setExProduct] = useState(null);
  const [exCount, setExCount] = useState(1);
  const [exPrice, setExPrice] = useState(0);
  const [exLines, setExLines] = useState([]);
  const [saving, setSaving] = useState(false);
  const { usuario } = useContext(ContextUser);
  const canModify = usuario?.role === 'admin';

  const handleDate = ({ target: { value } }) => { setDate(value) };

  useEffect(() => { if (date) fetchSales(); }, [date]);

  const fetchSales = async () => {
    try {
      const { data } = await axios.get(`${url}/api/v1/ventas/salesByDate?date=${date}`);
      setRows(Array.isArray(data) ? data.map(normRow) : []);
    } catch (e) {
      console.error(e);
    }
  };

  const summaryBySeller = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      const v = r.vendedor || "—";
      if (!map[v]) map[v] = { venta: 0, ganancia: 0 };
      map[v].venta += num(r.p_total);
      map[v].ganancia += num(r.ganancia);
    });
    return Object.entries(map);
  }, [rows]);
  const grandVenta = summaryBySeller.reduce((a, [, s]) => a + s.venta, 0);
  const grandGanancia = summaryBySeller.reduce((a, [, s]) => a + s.ganancia, 0);
  const confirmDevolucion = async () => {
    const mf = motivoFinal(motivoDev, motivoDevCustom);
    if (!mf) {
      alert("Selecciona o escribe el motivo");
      return;
    }
    setSaving(true);
    try {
      await axios.delete(`${url}/api/v1/ventas?id=${devSale.id_sale}&tipo=DEVOLUCION&motivo=${encodeURIComponent(mf)}`);
      alert("Devolución registrada: venta eliminada y cash restado");
      setDevSale(null);
      setMotivoDev("");
      setMotivoDevCustom("");
      fetchSales();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error al registrar devolución");
    } finally {
      setSaving(false);
    }
  };

  const openCambio = (r) => {
    setCambioSale(r);
    setMotivoCambio("");
    setMotivoCambioCustom("");
    setExProduct(null);
    setExCount(1);
    setExPrice(0);
    setExLines([]);
  };

  const addExchange = () => {
    if (!exProduct || !exProduct.id_product) {
      alert("Busca y selecciona el producto para el cambio");
      return;
    }
    const count = parseInt(exCount);
    const pUnit = num(exPrice);
    if (!(count > 0)) {
      alert("Cantidad debe ser mayor que cero");
      return;
    }
    if (!(pUnit > 0)) {
      alert("Precio inválido");
      return;
    }
    const revenue = parseFloat(((pUnit - num(exProduct.cost)) * count).toFixed(2));
    if (revenue < 0) {
      alert("El cambio es a perdida, por lo cual no se puede registrar!");
      return;
    }
    setExLines((prev) => [...prev, { product: exProduct, count, pUnit, revenue }]);
    setExProduct(null);
    setExCount(1);
    setExPrice(0);
  };

  const newTotal = exLines.reduce((a, l) => a + l.pUnit * l.count, 0);
  const refundTotal = cambioSale ? num(cambioSale.p_total) : 0;
  const diff = parseFloat((newTotal - refundTotal).toFixed(2));
  const confirmCambio = async () => {
    const mf = motivoFinal(motivoCambio, motivoCambioCustom);
    if (!mf) {
      alert("Selecciona o escribe el motivo");
      return;
    }
    if (exLines.length === 0) {
      alert("Agrega al menos un producto para el cambio");
      return;
    }
    setSaving(true);
    try {
      await axios.delete(`${url}/api/v1/ventas?id=${cambioSale.id_sale}&tipo=CAMBIO&motivo=${encodeURIComponent(mf)}`);
      const saleDate = String(cambioSale.fecha).slice(0, 10);
      for (const l of exLines) {
        await saleService.register(url, {
          dateSell: saleDate,
          count: l.count,
          total: parseFloat((l.pUnit * l.count).toFixed(2)),
          PUnit: l.pUnit,
          revenue: l.revenue,
          dataCustomer: cambioSale.cliente || mf,
          product: l.product,
          idUser: cambioSale.fk_id_user,
          idBranch: cambioSale.fk_id_branch
        });
      }
      alert(
        diff > 0
          ? `Cambio registrado. Diferencia S/.${diff.toFixed(2)} a cobrar`
          : diff < 0
            ? `Cambio registrado. Diferencia S/.${Math.abs(diff).toFixed(2)} a devolver al cliente`
            : "Cambio registrado sin diferencia"
      );
      setCambioSale(null);
      fetchSales();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error al registrar cambio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="divForm">
            <InputSimple titulo="Selecciona una fecha: " tipo="date" func={handleDate} valor={date}></InputSimple>
    </div>
     
      
    {<>
      <div className="result">
        <table className="infoTable">
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Cant</th>
              <th>Producto</th>
              <th>Total</th>
              <th>P. Unit</th>
              <th>Ganancia</th>
              <th>Hora</th>
              <th>Cliente</th>
              {canModify ? <th>Acciones</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id_sale}>
                <td>{r.vendedor}</td>
                <td>{r.cant}</td>
                <td>{r.producto}</td>
                <td>{r.p_total}</td>
                <td>{r.p_unit}</td>
                <td>{r.ganancia}</td>
                <td>{String(r.hora).slice(0, 5)}</td>
                <td>{r.cliente || "—"}</td>
                {canModify ? (
                  <td>
                    <button onClick={() => { setDevSale(r); setMotivoDev(""); setMotivoDevCustom(""); }}>Devolver</button>
                    <button onClick={() => openCambio(r)}>Cambiar</button>
                  </td>
                ) : null}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={canModify ? 9 : 8}>Sin ventas en esa fecha</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>}

    {rows.length > 0 && (
      <>
        {summaryBySeller.length > 1 && (
          <>
            <h3>Resumen por vendedor</h3>
            {summaryBySeller.map(([v, s]) => (
              <div key={v}>
                <div className="summarySell">
                  <p>{v} — Venta total:</p>
                  <p>S/.{s.venta.toFixed(2)}</p>
                </div>
                <div className="summarySell">
                  <p>{v} — Ganancia:</p>
                  <p>S/.{s.ganancia.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="summarySell">
          <p>Total del día — Venta:</p>
          <p>S/.{grandVenta.toFixed(2)}</p>
        </div>
        <div className="summarySell">
          <p>Total del día — Ganancia:</p>
          <p>S/.{grandGanancia.toFixed(2)}</p>
        </div>
      </>
    )}

    {devSale && (
      <div className="popup_frame">
        <button className="closeButton" onClick={() => setDevSale(null)}>X</button>
        <h3 className="title_popupwindow">Confirmar devolución</h3>
        <div className="product_modal_fields">
          <div className="product_modal_field"><strong>Producto:</strong><span>{devSale.producto}</span></div>
          <div className="product_modal_field"><strong>Cantidad:</strong><span>{devSale.cant}</span></div>
          <div className="product_modal_field"><strong>Total:</strong><span>S/. {devSale.p_total}</span></div>
          <div className="product_modal_field"><strong>Fecha:</strong><span>{String(devSale.fecha).slice(0, 10)}</span></div>
          <div className="product_modal_field"><strong>Hora:</strong><span>{String(devSale.hora).slice(0, 5)}</span></div>
          <div className="product_modal_field"><strong>Cliente:</strong><span>{devSale.cliente || "—"}</span></div>
          <div className="product_modal_field"><strong>Vendedor:</strong><span>{devSale.vendedor}</span></div>
        </div>
        <p>Se borrará la venta y se restará el cash.</p>
        <MotivoField motivo={motivoDev} setMotivo={setMotivoDev} custom={motivoDevCustom} setCustom={setMotivoDevCustom} />
        <button className="pop_up_button" onClick={confirmDevolucion} disabled={saving}>
          {saving ? "Procesando..." : "Confirmar devolución"}
        </button>
      </div>
    )}

    {cambioSale && (
      <div className="popup_frame proforma_frame">
        <button className="closeButton" onClick={() => setCambioSale(null)}>X</button>
        <h3 className="title_popupwindow">Cambio de venta #{cambioSale.id_sale}</h3>
        <div className="product_modal_fields">
          <div className="product_modal_field"><strong>Devuelve:</strong><span>{cambioSale.producto} x {cambioSale.cant} = S/. {cambioSale.p_total}</span></div>
          <div className="product_modal_field"><strong>Sucursal:</strong><span>{BRANCH_NAMES[cambioSale.fk_id_branch] || cambioSale.fk_id_branch}</span></div>
        </div>
        <MotivoField motivo={motivoCambio} setMotivo={setMotivoCambio} custom={motivoCambioCustom} setCustom={setMotivoCambioCustom} />
        <h3>Cambiar por</h3>
        <SearchInput urlApi={`${url}/api/v1/products`} funcSet={setExProduct} place="Buscar producto..." />
        {exProduct && <p>{exProduct.name} (costo S/.{exProduct.cost})</p>}
        <div className="proforma_head">
          <label>Cant: <input type="number" min="1" value={exCount} onChange={(e) => setExCount(e.target.value)} style={{ width: "70px" }} /></label>
          <label>P. Unit S/.: <input type="number" step="any" min="0" value={exPrice} onChange={(e) => setExPrice(e.target.value)} style={{ width: "90px" }} /></label>
          <button onClick={addExchange}>Agregar</button>
        </div>
        <div className="proforma_lines">
          {exLines.map((l, i) => (
            <div className="proforma_line" key={i}>
              <img
                className="proforma_img"
                src={l.product.url_image || noImagen}
                alt={l.product.name}
                onError={(e) => { e.currentTarget.src = noImagen; }}
              />
              <span className="proforma_name">{l.product.name}</span>
              <span>{l.count} x S/.{l.pUnit.toFixed(2)}</span>
              <span className="proforma_line_total">{(l.pUnit * l.count).toFixed(2)}</span>
              <button className="proforma_remove" onClick={() => setExLines((prev) => prev.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          {exLines.length === 0 && <p>Sin productos para el cambio</p>}
        </div>
        <div className="proforma_total">
          <span>Devuelto S/.{refundTotal.toFixed(2)}</span>
          <span>Nuevo S/.{newTotal.toFixed(2)}</span>
          <span>{diff > 0 ? `A cobrar S/.${diff.toFixed(2)}` : diff < 0 ? `A devolver S/.${Math.abs(diff).toFixed(2)}` : "Sin diferencia"}</span>
        </div>
        <button className="pop_up_button" onClick={confirmCambio} disabled={saving}>
          {saving ? "Procesando..." : "Confirmar cambio"}
        </button>
      </div>
    )}
    </>
  );
};

const SearchByMonth= ({urlB}) => {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));

  const handleDate = ({ target: { value } }) => {
    if (!value) return;
    setYear(value.substring(0, 4)),
    setMonth(value.substring(5, 7))
  };
  return (
    <>
    <div className="divForm">
    <InputSimple titulo="Fecha" tipo="month" func={handleDate} valor={`${year}-${month}`}></InputSimple>
    </div>

    {<>{ year && month ? <TableGet key={`${year}-${month}`} url={`${urlB}/api/v1/summaries/summaryByDay?year=${year}&month=${month}`} minWitdh="800px" headers={TABLE_HEADERS.summaryByDay}/> : <></>
    }</>}
    </>
  );
};

export const SearchSale = ({urlBase}) => {
  
const [option, setOption] = useState(1)

const handleOption = (e)=>{
  const value = parseInt(e.target.value)
     setOption(value)
}
return(



<>
<div className="search_sale_select">
<TitleForm text='Buscar Ventas Por:'></TitleForm>
    <select onChange={handleOption} >
      <option value="1">Fecha</option>
      <option value="2">Producto</option>
      <option value="3">Mensual</option>

    </select>
</div>
    
    {option === 1 && <SearchByDate url={urlBase} />}
    {option === 2 && <SearchByProduct urlBase={urlBase}/>}
    {option === 3 && <SearchByMonth urlB={urlBase}/>}


</>)
  
};
