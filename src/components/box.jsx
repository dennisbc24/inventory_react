import { useState, useEffect } from "react";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import "./css/box.css";
import { BoxService } from "../services/box.js";
const boxService = new BoxService()

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
                <th>Descripción</th>
                <th>Inicio</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
        { 
    debtList.map(element => {return(
            <tr key={element.id_debts}>
                <td>{element.currency === 'dolar' ? `$${element.debt}` :`S/.${element.debt}`}</td>
                <td>{element.expiration_date.slice(0,10)}</td>
                <td>{element.description}</td>
                <td>{element.initial_date.slice(0,10)}</td>
                <td>{element.paid === true ? <>pagado</> : <>sin pagar</>}</td>

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

const MoneyTransactions = (urlBase) => {
  
  return(
    <TitleForm text='Transferencias de dinero'></TitleForm>
  )
}

const NewTransation = (urlBase) => {
  
  return(
    <>
    <TitleForm text='Nueva Transferencia'></TitleForm>
    <input type="number" placeholder="Monto"/>
    <div>
    <h3>Description</h3><input type="text" placeholder="Motivo"/>

    </div>
    <div>
    <select >
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
    <select>
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
    </div>
    
    <button >Registrar</button>
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
  const [debt, setDebt] = useState(1)
  const [expiration_date, setExpDate] = useState('')
  const [description, setDescrption] = useState('')
  const [currency, setCurrency] = useState('')
  const [fk_user, setFkUser] = useState(1)

 const handleCLic = async ()=>{
    const body = { debt, expiration_date, description, currency, fk_user }
    const sendData = await boxService.register(urlBase, body)
    console.log(sendData);
    
 }
 
const handleDebt = ({ target: { value } }) => { setDebt(value) };
const handleDate = ({ target: { value } }) => { setExpDate(value) };
const handleDescription = ({ target: { value } }) => { setDescrption(value) };
const handleCurrency = ({ target: { value } }) => { setCurrency(value) };
const handleUser = ({ target: { value } }) => { setFkUser(parseInt(value)) };

return(<>
        <TitleForm text='Registrar Deuda'></TitleForm>
        <div><h3>Vencimiento</h3><input type="date" onChange={handleDate}/></div>
        <div><h3>Importe</h3><input type="number" onChange={handleDebt}/>        <select onChange={handleCurrency}><option value="sol">Soles</option><option value="dolar">Dolares</option></select>
        </div>
        <div><h3>Descripción</h3><input type="text" onChange={handleDescription}/></div>
        <div><select onChange={handleUser}><option value="1">Dennis</option><option value="2">Luz Marina</option><option value="3">Miguel Angel</option></select></div>
        <button onClick={handleCLic}>Registrar</button>
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
        <option value="4">Transferencias</option>
        <option value="5">Nueva Transacción</option>

      </select>
      {option === 1 && <BoxByUser urlBase={urlBase}/>}
      {option === 2 && <Debs urlBase={urlBase}/>}
      {option === 3 && <CreateDebt urlBase={urlBase}/>}
      {option === 4 && <MoneyTransactions urlBase={urlBase}/>}
      {option === 5 && <NewTransation urlBase={urlBase}/>}

      
        </>
      );
}



//http://localhost:3000/api/v1/ventas/lastSales?user=1
//http://localhost:3000/api/v1/box/lastSpends?user=1