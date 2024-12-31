import { useState, useEffect } from "react";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import "./css/box.css";


export const Debs = ({urlBase})=>{
  const [debtList, setDebtList] = useState([])
  const [show, setShow] = useState(false)
const urlBox = `${urlBase}/api/v1/box/debts`


useEffect(()=>{
  const getDebts= async () => {
try {
  const debts = await axios.get(urlBox)
  
  
setDebtList(debts.data)


setShow(true)
} catch (error) {
  console.error(error);
  
}
  }
  getDebts()
 
  
  //setShow(true)
},[])

return(
  <>
  <TitleForm text='Deudas'></TitleForm>
  {show ?
      
        <table>
        <thead>
            <tr>
                <th>Importe</th>
                <th>Vencimiento</th>
                <th>Inicio</th>
            </tr>
        </thead>
        <tbody>
        { 
    debtList.map(element => {return(
            <tr key={element.id_debts}>
                <td>{element.currency === 'dolar' ? `$${element.debt}` :`S/.${element.debt}`}</td>
                <td>{element.expiration_date.slice(0,10)}</td>
                <td>{element.initial_date.slice(0,10)}</td>
            </tr>
          )})}
        </tbody>
        <tfoot>
            <tr>
                <td>Total: 0</td>
            </tr>
        </tfoot>
    </table>
     
   : <></>}
  
  </>
  
)
}


const BoxByUser = ({urlBase}) => {
  
  const urlBox = `${urlBase}/api/v1/box/byUser?id=`

    const [box1, setBox1] = useState(0);
    const [box2, setBox2] = useState(0);
    const [box3, setBox3] = useState(0);

useEffect(()=>{
const fetchBox = async () => {
  try {
    const response1 = await axios.get(`${urlBox}1`)
    setBox1(response1.data.toFixed(2))
    const response2 = await axios.get(`${urlBox}2`)
    setBox2(response2.data.toFixed(2))
    const response3 = await axios.get(`${urlBox}3`)
    setBox3(response3.data.toFixed(2))
  } catch (e) {
    console.error('Error al solicitar información',e);
    
  }
}
fetchBox()
},[])
  return(<>
    <TitleForm text='Caja por usuario'></TitleForm>
   <div className="caja_item"><h3>Dennis:</h3><p>{`S/.${box1}`}</p></div>
   <div className="caja_item"><h3>Luz:</h3><p>{`S/.${box2}`}</p></div>
   <div className="caja_item"><h3>Miguel:</h3><p>{`S/.${box3}`}</p></div>

    </>)
}

const CreateDebt = ({urlBase}) => {
return(<>
        <TitleForm text='Registrar Deuda'></TitleForm>
        <div><h3>Vencimiento</h3><input type="date"/></div>
        <div><h3>Importe</h3><input type="number"/>        <select><option value="Dolar">Dolares</option><option value="Sol">Soles</option></select>
        </div>
        <div><h3>Descripción</h3><input type="text"/></div>
</>)
}

export const Box = ({urlBase}) => {
  const [option, setOption] = useState(1)

  const changeOption=(e)=>{
    const value = parseInt(e.target.value)
     setOption(value)
    
  }
    return (
        <>
        <TitleForm text='Caja'></TitleForm>
  <select onChange={changeOption}>
        <option value="1">Ver Caja</option>
        <option value="2">Ver Deudas</option>
        <option value="3">Nueva Deuda</option>

      </select>
      {option === 1 && <BoxByUser urlBase={urlBase}/>}
      {option === 2 && <Debs urlBase={urlBase}/>}
      {option === 3 && <CreateDebt urlBase={urlBase}/>}

      
        </>
      );
}