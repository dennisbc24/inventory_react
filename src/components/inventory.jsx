import { useState, useEffect } from "react";
import { SelectSimple, ButtonSave} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import axios from "axios";
import {  TableGet, TableGet2 } from "./table.jsx";
import {InventoryService} from "../services/inventory.js"
const service = new InventoryService()
export const Inventory = ({urlBase}) => {
  
  const [branch, setBranch] = useState(1);
  const [branch2, setBranch2] = useState(4);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [datos, setDatos] = useState(undefined);
  const [datos1, setDatos1] = useState(undefined);
  const [datos2, setDatos2] = useState(undefined);

  const [review, setReview] = useState(1);
  const [baseCount, setBaseCount] = useState(0);

  const [editandoId, setEditandoId] = useState(null);
  const [cantidadEditada, setCantidadEditada] = useState("");

  // seleccionar fila
  const handleDoubleClick = (id, cantidad) => {
    setEditandoId(id);
    setCantidadEditada(cantidad);
  };
  
// editar cantidad
const handleChange = (e) => {
  setCantidadEditada(e.target.value);
};

//guardar cantidad
const handleBlur = async (id) => {
  console.log(id, cantidadEditada);
  const urlPatch = `${urlBase}/api/v1/existence/count`
  console.log(urlPatch);
  
  const sendVending = async () => {
    try {
    const sendData = await axios.patch(urlPatch,{
      id_existence: id,
      count: cantidadEditada
    })

    setDatos1((prevDatos) => prevDatos.map((item) => item.id_existence === id ? { ...item, amount: cantidadEditada } : item ));
    alert(sendData.data); 

  } catch (error) {
    console.error("Error al actualizar la cantidad:", error);
  }
};
sendVending()
setEditandoId(null);
 
};

  const handleIdBranch = ({ target: { value } }) => { setBranch(parseInt(value)), setShow(false)};
  const handleIdBranch2 = ({ target: { value } }) => { setBranch2(parseInt(value)), setShow2(false)};
  const handleBaseCount = ({ target: { value } }) => { setBaseCount(parseInt(value)), setShow2(false)};

  const handleButton = () => {setShow(true), 
    
    setShow2(false)
    
  }
  const handleReview = ({target: {value}}) => {setReview(parseInt(value)), setShow2(false), setShow(false)}
  
  useEffect(()=>{
    const getData = async () => {
  try {
    const data = await axios.get(`${urlBase}/api/v1/existence/inventary?branch=${branch}`)
  setDatos(data.data)
  //setShow(true)
  } catch (error) {
    console.error(error);
  }
    }
    getData()
      },[])

  useEffect(()=>{
    const getData2 = async () => {
  try {
    const data = await axios.get(`${urlBase}/api/v1/existence/shortSupply`)
  setDatos2(data.data)
  } catch (error) {
    console.error(error);
  }
    }
    getData2()
      },[review])



      useEffect(()=>{
        const getData = async () => {
      try {
        const data = await axios.get(`${urlBase}/api/v1/existence/inventary?branch=${branch}`)
                
        setDatos1(data.data)
      //setShow(true)
      } catch (error) {
        console.error(error);
      }
        }
        getData()
          },[branch])

const searchShortSupplies = async () => {
  setShow(false)
  setShow2(false)
    setShow3(true)
}
const handleTest = async () =>{
  const {sortArray} =  await service.CompareInventories({store:branch,deposit:branch2, urlBase, baseCount})
  setDatos(sortArray)
  setShow(false)
  setShow2(true)
}
  return (
    <>
    <SelectSimple titulo="Revisar"func={handleReview}>
          <option value="1">Inventario por local</option>
          <option value="2">Diferencia por local</option>
          <option value="3">Llegando a 0</option>

          
        </SelectSimple>
    
    <>
        {review === 1 && <>
        
          <TitleForm text='Inventario por local'></TitleForm>
        <div className="divForm">
        <SelectSimple titulo="Establecimiento"func={handleIdBranch}>
              <option value="1">B17</option>
              <option value="3">Departamento</option>
              <option value="7">Tambopata</option>
              <option value="4">Deposito</option>
              <option value="5">Los Nogales</option>
              <option value="6">Los Incas</option>
            </SelectSimple>
            
        </div>
        <ButtonSave titulo={"Buscar"} func={handleButton}></ButtonSave>
        </>
        }
        {review === 2 && 
          <> <>
        
          <TitleForm text='Inventario por local'></TitleForm>
        <div className="divForm">
        <SelectSimple titulo="Establecimiento"func={handleIdBranch}>
              <option value="1">B17</option>
              <option value="3">Departamento</option>
              <option value="7">Tambopata</option>
              <option value="4">Deposito</option>
              <option value="5">Los Nogales</option>
              <option value="6">Los Incas</option>
            </SelectSimple>
            
        </div>
        </>
              <SelectSimple titulo="Comparar con.."func={handleIdBranch2}>
              <option value="4">Deposito</option>
              <option value="3">Departamento</option>
              <option value="7">Tambopata</option>
              <option value="1">B17</option>
              <option value="5">Los Nogales</option>
              <option value="6">Los Incas</option>
            </SelectSimple>
            <SelectSimple titulo="Cantidad base"func={handleBaseCount}>
            <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              
            </SelectSimple>
              <ButtonSave titulo={"Comparar"} func={handleTest}></ButtonSave>
          </>}
          {review === 3 && <ButtonSave titulo={"Buscar"} func={searchShortSupplies}></ButtonSave>}
                     
    </>
    {<>{ show ? 
    <>
        <div>{datos1 === undefined ? <></> : 
        <table>
          <thead>
            <tr>
              <td>Producto</td>
              <td>Cantidad</td>
              <td>Costo</td>
              <td>Sucursal</td>
              <td>Código</td>

            </tr>
          </thead>
          <tbody>
            {datos1.map(item => {
              return (
                <tr key={item.id_existence}>
                  <td>{item.product}</td>
                  <td onDoubleClick={() => handleDoubleClick(item.id_existence, item.amount)}>
                {editandoId === item.id_existence ? (
                  <input
                    type="number"
                    value={cantidadEditada}
                    onChange={handleChange}
                    onBlur={() => handleBlur(item.id_existence)}
                    autoFocus
                  />
                ) : (
                  <p>{item.amount}</p>
                )}
              </td>
                  <td>{item.costo}</td>
                  <td>{item.sucursal}</td>
                  <td>{item.id_existence}</td>

                  
                </tr>
              );
            })}
          </tbody>
        </table>
        }</div>

    </>
    : <></>}</>}
    
        {<>{ show2 ? <TableGet2 respJson={datos} minWitdh="450px"/> : <></>}</>}
        {<>{ show3 ? 
    <>
        <div className="result">{datos2 === undefined ? <></> : 
        <div>
          <table style={{width:"920px"}}>
          <thead>
            <tr>
              {/* <td>fk_product</td> */}
              <td>producto</td>
              <td>proveedor</td>
              <td>Ultima venta</td>
              <td>ventas por año</td>
              <td>ganancia anual</td>
              <td>stock actual</td>
              <td>v. cada cuantos dias</td>
              <td>dias restantes</td>
            </tr>
          </thead>
          <tbody>
            {datos2.map(item => {
              return (
                <tr key={item.id_existence}>
                  {/* <td>{item.fk_product}</td> */}
                  <td>{item.product_name}</td>
                  <td>{item.supplier_name}</td>
                  <td>{(item.ultima_fecha_venta.slice(0,10))}</td> 
                  <td>{item.total_vendido_12m}</td>
                  <td>{item.total_ingresos_12m}</td>
                  <td>{item.total_stock}</td>
                  <td>{parseInt(item.dias_entre_ventas)}</td>
                  <td>{parseInt(item.dias_hasta_stock_cero)}</td>
                  

                  
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        
        }</div>

    </>
    : <></>}</>}
    </>
    
  );
};


