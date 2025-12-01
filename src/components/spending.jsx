import { useState } from "react";
import {  InputSimple,  SelectSimple, ButtonSave} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";

export const SendExpense = ({urlBase}) => {
  const urlUpload = `${urlBase}/api/v1/box`

    const [concept, setConcept] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState(0);
    const [user, setUser] = useState(1);
    const [type, setType] = useState('true');


    const handleConcept = ({ target: { value } }) => { setConcept(value)};
    const handleMount = ({ target: { value } }) => { setAmount(value)}
    const handleDate = ({ target: { value } }) => { setDate(value)}
    const handleUser = ({ target: { value } }) => { setUser(parseInt(value))}
    const handleType = ({ target: { value } }) => { setType(value)}

    const handleButton = () => {
        const sendData = async () => {
    try {
      const sendData = await axios.post(urlUpload,{
        concept: concept,
        amount: amount,
        date: date,
        user: user,
        bill: type
      })
      
      console.log('exito');
      alert('Gasto registrado con éxito')
    } catch (error) {
      console.error("Error de solicitud:", error);
    }
  };

  sendData()
  
  
};

    return (
        <>
        <TitleForm text='Salidas de dinero'></TitleForm>
          
          <div className="divForm">
          <InputSimple titulo="Monto" tipo="number" func={handleMount} callToAction="Cuánto fue?"></InputSimple>
          <InputSimple titulo="Concepto" tipo="text" func={handleConcept} callToAction="Para qué fue?"></InputSimple>
          <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple>
          <SelectSimple titulo="Usuario" func={handleUser}>
              <option value="1">Dennis</option>
              <option value="2">Luz Marina</option>
              <option value="3">Miguel Ángel</option>
            </SelectSimple>
            <SelectSimple titulo="Tipo"func={handleType}>
              <option value="true">Gasto</option>
              <option value="false">Mercadería</option>
              
            </SelectSimple>
          </div>
          <ButtonSave titulo={"Guardar"} func={handleButton}/>
          
        </>
      );
}