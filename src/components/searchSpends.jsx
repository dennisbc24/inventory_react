import { useState, useEffect } from "react";
import { InputSimple } from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import axios from "axios";
const SpendsByUser = ({urlBase}) => {

  const [data, setData] = useState([]);
  const [user, setUser] = useState(1);
  const [total_saldo, setTotal_saldo] = useState(0)


  const urlToCash = `${urlBase}/api/v1/users/getCash?id=${user}`

  const urlLastSpends = `${urlBase}/api/v1/box/lastSpends?user=${user}`

 const handleCLic = async () => {

  const requestLastSpends = await axios.get(urlLastSpends)
    const requestCash = await axios.get(urlToCash)

    setTotal_saldo(requestCash.data[0].cash)
    setData(requestLastSpends.data)

 }

  useEffect(() => { handleCLic(); }, [user]);
  
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

    <><h2>Saldo Actual: </h2><p>{total_saldo}</p></>
    {<><table>
        <thead>
            <tr>
                <th>Concepto</th>
                <th>Fecha</th>
                <th>Monto</th>

            </tr>
        </thead>
        <tbody key={self.crypto.randomUUID()}>
        {
    data.map(element => {return(
            <tr key={self.crypto.randomUUID()}>
                <td  >{element.concept}</td>
                <td >{element.date.slice(0,10)}</td>
                <td >{`S/.${element.amount}`}</td>
            </tr>
          )})
        }
        </tbody>

    </table>
    </>}
    </>
  );
}
const SpendsByMonth =({urlBase})=>{
  const now = new Date();
  const [date, setDate] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(1);
  const [total_saldo, setTotal_saldo] = useState(0)


  const urlToGet = `${urlBase}/api/v1/box/transByUSer?date=${date}&user=${user}`
  const urlToCash = `${urlBase}/api/v1/users/getCash?id=${user}`

  const handleDate = ({ target: { value } }) => {
    if (!value) return;
    setDate(value)
};


  const handleCLic = async () => {


    const requestCash = await axios.get(urlToCash)
    const requestData = await axios.get(urlToGet)

    setTotal_saldo(requestCash.data[0].cash)
    setData(requestData.data)


  }

  useEffect(() => { if (date) handleCLic(); }, [date, user]);
  
 const handleUser = (e) => {
  setUser(e.target.value)
 }
  return (
    <>
    <TitleForm text='Gastos por Mes'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="Fecha" tipo="month" func={handleDate} valor={date}></InputSimple>
            <select onChange={handleUser} >
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
    </div>

    <><h2>Saldo Actual: </h2><p>{total_saldo}</p></>
    {<><table>
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

    </table>
    </>}
    </>
  );
}

export const SearchSpends = ({urlBase}) => {
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

