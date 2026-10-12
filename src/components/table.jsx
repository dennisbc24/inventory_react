
import { useState, useEffect } from "react";
import axios from "axios";
import "./table.css"
import { ProductModal, IMAGE_KEYS } from "./form/productModal.jsx";

const HEADER_NAMES = {
  id_sale: 'Código', id_product: 'Código', id_shopping: 'ID', id_entry: 'ID',
  id_existence: 'ID', id_money_movement: 'ID', id_supplier: 'ID', id_category: 'ID',
  id_user: 'ID', id_debts: 'ID', id_transaction: 'ID',
  fk_product: 'Cód. Producto', fk_id_user: 'Usuario ID', fk_id_branch: 'Sucursal ID',
  fk_branch: 'Sucursal ID', fk_user: 'Usuario ID', fk_supplier: 'Proveedor ID',
  fk_category: 'Categoría ID', fk_existence: 'Existencia ID',
  fk_existence_a: 'Origen ID', fk_existence_b: 'Destino ID',
  p_total: 'Total', p_unit: 'P. Unit', v_total: 'Venta Total',
  total_venta: 'Venta Total', venta_total_hoy: 'Venta Total Hoy',
  ganancia_total_hoy: 'Ganancia Total Hoy', ganancia_total: 'Ganancia Total',
  suma_total: 'Stock Total', total_stock: 'Stock Total', stock_actual: 'Stock Actual', stock_total: 'Stock Total',
  total_unidades_vendidas: 'Unidades Vendidas', cantidad_ventas: 'N° Ventas',
  total_vendido_12m: 'Vendido 12M', total_ingresos_12m: 'Ingresos 12M',
  dias_entre_ventas: 'Días entre ventas', dias_hasta_stock_cero: 'Días hasta stock cero',
  ultima_fecha_venta: 'Última venta', suma_mes: 'Total mes', suma_revenue: 'Ganancia',
  product_name: 'Producto', supplier_name: 'Proveedor',
  lowest_price: 'P. Mayor', list_price: 'P. Unitario',
  is_online: 'Online', img: 'Imagen', url_image: 'Imagen',
  created: 'Creado', updated: 'Actualizado',
  expiration_date: 'Vencimiento', initial_date: 'Inicio',
  concept: 'Concepto', amount: 'Cantidad', costo: 'Costo', cost: 'Costo',
  nombre: 'Nombre', name: 'Nombre', producto: 'Producto', product: 'Producto',
  cantidad: 'Cantidad', ganancia: 'Ganancia', revenue: 'Ganancia', suma: 'Ganancia',
  usuario: 'Usuario', vendedor: 'Vendedor', cliente: 'Cliente', customer: 'Cliente',
  fecha: 'Fecha', date: 'Fecha', hora: 'Hora', hour: 'Hora',
  descripcion: 'Descripción', description: 'Descripción',
  added_by: 'Agregado por', source: 'Origen', status: 'Estado',
  paid: 'Pagado', debt: 'Deuda', currency: 'Moneda',
  branch: 'Sucursal', sucursal: 'Sucursal', valor: 'Valor', total: 'Total',
  exist: 'ID', idpro: 'Cód. Producto', mes: 'Mes', año: 'Año',
  category_name: 'Categoría', category_slug: 'Slug', supplier: 'Proveedor',
  attributes: 'Atributos', cant: 'Cant', gasto: 'Gasto', venta: 'Venta',
  articulo: 'Artículo', codigo: 'Código'
};

const prettyHeader = (key, overrides) => {
  if (!key) return '';
  const raw = String(key);
  if (overrides && overrides[raw] !== undefined) return overrides[raw];
  const lower = raw.toLowerCase();
  if (overrides && overrides[lower] !== undefined) return overrides[lower];
  if (HEADER_NAMES[lower]) return HEADER_NAMES[lower];
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const TABLE_HEADERS = {
  products: { id_product: 'Código', name: 'Nombre', cost: 'Costo S/.', created: 'Creado', supplier: 'Proveedor', lowest_price: 'P. Mayor S/.', list_price: 'P. Unitario S/.', fk_supplier: 'Prov. ID', updated: 'Actualizado', url_image: 'Imagen', fk_category: 'Cat. ID', is_online: 'Online', attributes: 'Atributos', category_name: 'Categoría', category_slug: 'Slug', stock_total: 'Stock Total' },
  sales: { fecha: 'Fecha', cantidad: 'Cantidad', producto: 'Producto', p_total: 'Total S/.', p_unit: 'P. Unit S/.', ganancia: 'Ganancia S/.', hora: 'Hora', cliente: 'Cliente' },
  saleByProduct: { codigo: 'Código', sucursal: 'Sucursal', vendedor: 'Vendedor', fecha: 'Fecha', hora: 'Hora', cantidad: 'Cantidad', articulo: 'Artículo', p_total: 'Total S/.', p_unit: 'P. Unit S/.', ganancia: 'Ganancia S/.', cliente: 'Cliente' },
  entries: { branch: 'Sucursal', amount: 'Cantidad', product: 'Producto', usuario: 'Vendedor', updated: 'Fecha', id_entry: 'ID' },
  transactions: { cantidad: 'Cantidad', usuario: 'Usuario', date: 'Fecha', producto: 'Producto', origen: 'Origen', destino: 'Destino', id_transaction: 'ID' },
  existence: { branch_name: 'Sucursal', amount: 'Cantidad', product: 'Producto', created: 'Creado', updated: 'Actualizado', id_existence: 'ID' },
  suppliers: { id_supplier: 'ID', name: 'Nombre' },
  byName: { product: 'Producto', stock: 'Stock' },
  inStock: { product: 'Producto', total_amount: 'Stock total', costo: 'Costo S/.' },
  stockLow: { id_product: 'Código', nombre: 'Nombre', costo: 'Costo S/.', suma_total: 'Stock Total', valor: 'Valor S/.' },
  topSelling: { producto: 'Producto', ganancia: 'Ganancia S/.', cantidad: 'Cantidad vendida' },
  bestProducts: { fk_product: 'Cód. Producto', producto: 'Producto', total_unidades_vendidas: 'Unidades vendidas', ganancia_total: 'Ganancia total S/.', cantidad_ventas: 'N° ventas', stock_actual: 'Stock actual' },
  summaryByDay: { dia: 'Día', total_ventas: 'Ventas S/.', ganancia: 'Ganancia S/.' },
  salesMonthly: { año: 'Año', mes: 'Mes', suma_mes: 'Total vendido' }
};

const TableTh =  ({urlApi, token, hideImages, headers}) =>{

  let config = {
    headers:{
      'Authorization': `Bearer ${token}`
    }
  }

  const [llaves, setLlaves] = useState([])

  useEffect(()=>{
    axios.get(urlApi, config)
    .then(function (response) {
      const data3 = response.data
      setLlaves(Object.keys(data3[0]).filter(k => !(hideImages && IMAGE_KEYS.includes(k))))
      
      
      
    })
      .catch(function (error) {
      // handle error
      console.log(error);
    })
  },[])
  
     
return(
  llaves.map((sell)=>{
  
  return(<th key={sell} >{prettyHeader(sell, headers)}</th>)
}
    
  )
)
  
}



const TableTd2 =  (Adata) =>{ 
const {dato, hideImages} = Adata

  const data = Object.entries(dato).filter(([key]) => !(hideImages && IMAGE_KEYS.includes(key)))
  const render = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') {
      if (Array.isArray(v)) return v.join(', ');
      const keys = Object.keys(v);
      if (keys.length === 0) return '';
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    if (typeof v === 'boolean') return v ? 'Sí' : 'No';
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)) return v.slice(0, 10);
    return String(v);
  };
    return(   
  <>{data.map(([key, ele])=>{
    return(<td key={key}>{render(ele)}</td>)})
      }
  </>)
}

const TableTr =  ({urlApi, token, modify, showDetail, setSelected, hideImages}) =>{

  let config = {
    headers:{
      'Authorization': `Bearer ${token}`
    }
  }
  const [fill, setFill] = useState([])
  useEffect(()=>{
    axios.get(urlApi, config)
    .then(function (response) {
      const data3 = response.data
      setFill(data3)
      
    })
      
    .catch(function (e) { console.log(e)})
  },[])


  useEffect(()=>{
    sumas()
  }, [fill])

  function sumas(){
    let suma = []
    let suma2 = []
    fill.map((el)=>{

    const campo2 = 'p_total'
    const campo = 'ganancia'
    if (campo in el) {
      const itemRevenue = el[campo]
      suma.push(itemRevenue)
      
    }
    if (campo2 in el) {
      const itemRevenue2 = el[campo2]
      suma2.push(itemRevenue2)
      
    }
    
    })
    let ganancia = suma.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    let vTotal = suma2.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    modify({v_total:vTotal,suma:ganancia})
   
  }

return(
  <>
  {
    
    fill.map((ele)=>{
      
      
      return(
        <tr key={crypto.randomUUID()}>
        <TableTd2 dato={ele} hideImages={hideImages}/>
        {showDetail ? <td><button onClick={() => setSelected(ele)}>Ver</button></td> : null}
      </tr>
      )
    })
    
  }
  
  </>
)

}



export  function TableGet({url, minWitdh='1051px', token, title, showDetail=false, headers=null}) {
  const [sumar, setSumar] = useState({v_total:0,suma:0})
  const [selectedRow, setSelectedRow] = useState(null)
  
      return(
      <>
      {title ? <h3>{title}</h3> : null}
      <div className="result">
<table className="infoTable" style={{'minWidth':`${minWitdh}`,'width':'100%'}}>
        <thead className="table_header">
          <tr>
              {<TableTh urlApi={url} token={token} hideImages={showDetail} headers={headers}/> }
              {showDetail ? <th>Ver</th> : null}

          </tr>
        </thead>
        <tbody className="table_body">
          <TableTr urlApi={url} token={token} modify={setSumar} showDetail={showDetail} setSelected={setSelectedRow} hideImages={showDetail} />
      
    </tbody>
    {<>{sumar.suma > 0 ? <tfoot>
          <tr>
            <td>Venta Total</td>
            <td>S/.{sumar.v_total}</td>
            <td>Ganancia</td>
            <td>S/.{sumar.suma}</td>
          </tr>
        </tfoot> : <></>
    }</>}
        
  </table>
      </div>
      {selectedRow ? <ProductModal product={selectedRow} onClose={() => setSelectedRow(null)}/> : null}
      </>
  
        )}


const TableThTest =  ({respJson, headers}) =>{
  const [llaves, setLlaves] = useState([])

  useEffect(()=>{
      const data3 = respJson
      setLlaves(Object.keys(data3[0]))
      },[])

return(
  llaves.map((sell)=>{
  return(<th key={sell} >{prettyHeader(sell, headers)}</th>)
}
  )
  )
}
const TableTrTest =  ({respJson}) =>{
  
const data = respJson 
return(
  <>
  {
    data.map((ele)=>{

      
      return(
        <tr key={crypto.randomUUID()}>
        <TableTd2 dato={ele}/>
      </tr>
      )
    })
  }
  </>
)

}
export  function TableGet2({respJson, minWitdh='1051px', headers=null}) {
  
 const array  = respJson
          return(
          <div className="result">
     <table className="infoTable" style={{'minWidth':`${minWitdh}`}}>
            <thead className="table_header">
              <tr>
                  {<TableThTest respJson={array} headers={headers}/> }      
    
              </tr>
            </thead>
            <tbody className="table_body">
              <TableTrTest respJson={array} />
          
        </tbody>
      </table>
          </div>
     
            )}