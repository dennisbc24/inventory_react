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
  const [amount, setAmount] = useState(0)
  const [user, setUser] = useState(0)
  const [idDebt, setIdDebt] = useState(0)
  const [concept, setConcept] = useState('')
  const [total, setTotal] = useState(0)
  const [change, setChange] = useState('')

const urlBox = `${urlBase}/api/v1/box/debts`
const urlPayDebt = `${urlBase}/api/v1/box/payDebt`


const handleCLic = async () => {
  const body = {idDebt, user, total, concept }
  const sendData = await axios.post(urlPayDebt, body)
  alert("data sent")

}

const handleDebt = (e) => {
  const value = e.target.value;
  
  debtList.forEach((elem) => {
    if (elem.id_debts == value) {
      setChange(elem.currency)
      setAmount(elem.debt);
      setIdDebt(elem.id_debts);
      if(elem.currency==="sol"){
        setTotal(elem.debt)
        setConcept(elem.description);

      }else{
        setTotal(0)
        setConcept(`${elem.description}: $${elem.debt}`);
      }
    }
    
  });


}

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
const handleUser = (e) => {
const value = parseInt(e.target.value)
setUser(value)
}

const handleChangeType = (e) => {
const value = e.target.value
const product = value * amount
setTotal(product.toFixed(2))

}
return(
  <>
  <TitleForm text='Deudas'></TitleForm>
  {show ?
      <>
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
          <div>
          <div>
            <h3>usuario</h3>
            <select onChange={handleUser} value={user} placeholder="">
              <option value="">Seleccione una opción</option>
              <option value="1">Dennis</option>
              <option value="2">Luz Marina</option>
              <option value="3">Miguel Angel</option>

            </select>
            </div>
            <div>
              {
                user!=0 ? <div>
                <h3>Elige el monto a pagar</h3>
              <select onChange={handleDebt}>
              <option value="" >Seleccione una opción</option>
                {debtList.map(ele=>{return(
                  ele.paid === false ?                <option key={ele.id_debts} value={ele.id_debts}> {ele.currency === 'dolar' ? `$${ele.debt}` :`S/.${ele.debt}`}</option>
                  :<></> 
                )})}
              </select>
                </div> 
                :
                <></>
              }
              
              
            {change === 'dolar' ? <div>
            <h3>Tipo de cambio: </h3>
            <input type="number" onChange={handleChangeType}/>
            </div> : <></> }
            
              
            </div>
            <div>
              
              <h3>Total</h3>
              <p>{`S/.${total}`}</p>
            </div>

            
            <button onClick={handleCLic}>Pagar</button>
          </div>

      </>
        
    
   : <></>}
  
  </>
  
)
}

const MoneyTransactions = (urlBase) => {
  
  return(
    <TitleForm text='Transferencias de dinero'></TitleForm>
  )
}

const PayDebt = (urlBase) => {
  
  return(
    <>
      <TitleForm text='Pagar una deuda'></TitleForm>
      
    </>
    
  )
}

const NewTransation = ({urlBase}) => {
  const [userA, setUserA] = useState(1)
  const [userB, setUserB] = useState(1)
  const [concept, setConcept] = useState(1)
  const [amount, setAmount] = useState(1)

 const urlPost = `${urlBase}/api/v1/box/newTrans`

  const handleCLic = async () => {
    console.log(urlPost);
    
    const saveTransaction = await axios.post(urlPost, {
      userA,
      userB,
      concept:`TRD ${concept}`,
      amount
    })
    alert("Registro guardado con éxito!")
  }
  const handleUserA = (e) => {
    const value = parseInt(e.target.value)
    setUserA(value)
  }
  const handleUserB = (e) => {
    const value = parseInt(e.target.value)
    setUserB(value)
  }
  const handleConcept = (e) => {
    const value = e.target.value
    setConcept(value)
  }
  const handleAmount = (e) => {
    const value = e.target.value
    setAmount(value)
  }
  return(
    <>
    <TitleForm text='Nueva Transferencia'></TitleForm>
    <input type="number" placeholder="Monto" onChange={handleAmount}/>
    <div>
    <h3>Description</h3><input type="text" placeholder="Motivo" onChange={handleConcept}/>

    </div>
    <div>
      <div>
        <h3>De: </h3>
      <select onChange={handleUserA}>
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
      </div>
    <div>
      <h3>Hacia: </h3>
    <select onChange={handleUserB}>
      <option value="1">Dennis</option>
      <option value="2">Luz Marina</option>
      <option value="3">Miguel</option>
    </select>
    </div>
    
    </div>
    
    <button onClick={handleCLic}>Registrar</button>
    </>
    
  )
}


const BoxByUser = ({urlBase}) => {
    const [box1, setBox1] = useState(0);
    const [box2, setBox2] = useState(0);
    const [box3, setBox3] = useState(0);
    const urlToCash = `${urlBase}/api/v1/users/getCash?id=`

useEffect(()=>{
const fetchBox = async () => {
  try {
    const requestCash = await axios.get(urlToCash)
    const response1 = await axios.get(`${urlToCash}1`)
    setBox1(response1.data[0].cash)
    const response2 = await axios.get(`${urlToCash}2`)
    setBox2(response2.data[0].cash)
    const response3 = await axios.get(`${urlToCash}3`)
    setBox3(response3.data[0].cash)
    
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
  const [currency, setCurrency] = useState('sol')
  const [fk_user, setFkUser] = useState(1)

 const handleCLic = async ()=>{
    const body = { debt, expiration_date, description, currency, fk_user }
    const sendData = await boxService.register(urlBase, body)
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
        <option value="6">Pagar Deuda</option>

      </select>
      {option === 1 && <BoxByUser urlBase={urlBase}/>}
      {option === 2 && <Debs urlBase={urlBase}/>}
      {option === 3 && <CreateDebt urlBase={urlBase}/>}
      {option === 4 && <MoneyTransactions urlBase={urlBase}/>}
      {option === 5 && <NewTransation urlBase={urlBase}/>}
      {option === 6 && <PayDebt urlBase={urlBase}/>}

      
        </>
      );
}
