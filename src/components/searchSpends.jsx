import { useState } from "react";
import {  ButtonSave, InputSimple} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet } from "./table.jsx";
import axios from "axios";

export const SearchSpends = ({urlBase, token}) => {
  
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
    <TitleForm text='Buscar Gastos'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="Fecha" tipo="month" func={handleDate}></InputSimple>
            <select onChange={handleUser} >
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
    </div>
    
    <ButtonSave titulo={"Buscar"} func={handleCLic}/>
    {show ? <><h2>Saldo Actual: </h2><p>{total_saldo}</p></> : <></>}
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
            <tr style={element.amount <=0 ?{"color": "red"}: {"color": "black"}} key={element.id_money_movement}>
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
};
