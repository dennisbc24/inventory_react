import { useState } from "react";
import {  ButtonSave, InputSimple} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import axios from "axios";
const SpendsByUser = ({urlBase}) => {
  
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(1);
  const [total_saldo, setTotal_saldo] = useState(0)
  const [dataSales, setDataSales] = useState([]);
  

  const urlToCash = `${urlBase}/api/v1/users/getCash?id=${user}`

  const urlLastSpends = `${urlBase}/api/v1/box/lastSpends?user=${user}`
  const urlLastSales = `${urlBase}/api/v1/ventas/lastSales?user=${user}`

 const handleCLic = async () => {

  const requestLastSales = await axios.get(urlLastSales)
  const requestLastSpends = await axios.get(urlLastSpends)
    const requestCash = await axios.get(urlToCash)
    
    setDataSales(requestLastSales.data)
    const dataSalesTemp = requestLastSales.data
    const dataSpendsTemp = requestLastSpends.data
    
    setTotal_saldo(requestCash.data[0].cash)
    setShow(true)


    const newArray = dataSalesTemp.map(item => ({
      concept: `Venta: ${item.producto}`,
      date: item.date,
      amount: item.p_total
    }))
     const twoArrays = [...newArray,...dataSpendsTemp].sort((a,b)=> new Date(b.date) - new Date(a.date))
     setData(requestLastSpends.data)
     
 }
  
 const handleUser = (e) => {
  setUser(e.target.value)
 }
  return (
    <>
    <TitleForm text='Gastos Por Usuario'></TitleForm>
    <div className="divForm">
            <select onChange={handleUser} >
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
    </div>
    
    <ButtonSave titulo={"Buscar"} func={handleCLic}/>
    {/* {show ? <><h2>Saldo Actual: </h2><p>{total_saldo}</p></> : <></>} */}
    {<>{ show ? <table>
        <thead>
            <tr>
                <th>Concepto</th>
                <th>Fecha</th>
                <th>Monto</th>
                
            </tr>
        </thead>
        <tbody key={self.crypto.randomUUID()}>
        { show ?
    data.map(element => {return(
            <tr key={self.crypto.randomUUID()}>
                <td  >{element.concept}</td>
                <td >{element.date.slice(0,10)}</td>
                <td >{`S/.${element.amount}`}</td>
            </tr>
          )})
        : <></>}
        </tbody>
        
    </table> : <></>
    }</>}
    </>
  );
}
const SpendsByMonth =({urlBase})=>{
  const [date, setDate] = useState('');
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(1);
  const [total_saldo, setTotal_saldo] = useState(0)
  

  const urlToGet = `${urlBase}/api/v1/box/transByUSer?date=${date}&user=${user}`
  const urlToCash = `${urlBase}/api/v1/users/getCash?id=${user}`

  const handleDate = ({ target: { value } }) => { 
    setDate(value), 
    console.log(date);
    
    setShow(false)
    
};
  

 const handleCLic = async () => {

  
    const requestCash = await axios.get(urlToCash)
    const requestData = await axios.get(urlToGet)
    
    setTotal_saldo(requestCash.data[0].cash)
    setData(requestData.data)
    setShow(true)


     
 }
  
 const handleUser = (e) => {
  setUser(e.target.value)
 }
  return (
    <>
    <TitleForm text='Gastos por Mes'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="Fecha" tipo="month" func={handleDate}></InputSimple>
            <select onChange={handleUser} >
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
    </div>
    
    <ButtonSave titulo={"Buscar"} func={handleCLic}/>
    {/* {show ? <><h2>Saldo Actual: </h2><p>{total_saldo}</p></> : <></>} */}
    {<>{ show ? <table>
        <thead>
            <tr>
                <th>Concepto</th>
                <th>Fecha</th>
                <th>Monto</th>
                
            </tr>
        </thead>
        <tbody>
        { 
    data.map(element => {return(
            <tr  key={element.id_money_movement}>
                <td >{element.concept}</td>
                <td >{element.date.slice(0,10)}</td>
                <td >{`S/.${element.amount}`}</td>
            </tr>
          )})}
        </tbody>
        
    </table> : <></>
    }</>}
    </>
  );
}

export const SearchSpends = ({urlBase, token}) => {
 const [opt, setOpt] = useState(1) 

 const changeOption =  (e) => {
  const value = parseInt(e.target.value)
  setOpt(value)
 }
  return(
    <>
    <TitleForm text='Buscar Gastos'></TitleForm>

    <select onChange={changeOption}>
      <option value="1">Por Usuario</option>
      <option value="2">Por Mes</option>
    </select>
    {opt === 1 && <SpendsByUser urlBase={urlBase}/>}
    {opt === 2 && <SpendsByMonth urlBase={urlBase}/>}

    </>
  )
};

