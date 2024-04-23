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
    const [user, setUser] = useState('B17');
    const [type, setType] = useState('false');


    const handleConcept = ({ target: { value } }) => { setConcept(value)};
    const handleMount = ({ target: { value } }) => { setAmount(value)}
    const handleDate = ({ target: { value } }) => { setDate(value)}
    const handleUser = ({ target: { value } }) => { setUser(value)}
    const handleType = ({ target: { value } }) => { setType(value)}

    const handleButton = () => {
        const sendData = async () => {
    try {
      const sendData = await axios.post(urlUpload,{
        concept: concept,
        amount: parseInt(amount),
        date: date,
        branch: user,
        bill: type
      })

      console.log('exito');
      
    } catch (error) {
      console.error("Error de solicitud:", error);
    }
  };

  sendData()
  
  
};

    return (
        <>
        <TitleForm text='Registrar Gasto'></TitleForm>
          
          <div className="divForm">
          <InputSimple titulo="Concepto" tipo="text" func={handleConcept} callToAction="Para qué fue?"></InputSimple>
          <InputSimple titulo="Monto" tipo="number" func={handleMount} callToAction="Cuánto fue?"></InputSimple>
          <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple>
          <SelectSimple titulo="Usuario" func={handleUser}>
              <option value="B17">B17</option>
              <option value="luz">Luz Marina</option>
              <option value="miguel">Miguel Ángel</option>
            </SelectSimple>
            <SelectSimple titulo="Tipo"func={handleType}>
              <option value="false">Inversion</option>
              <option value="true">Egreso</option>
            </SelectSimple>
          </div>
          <ButtonSave titulo={"Guardar"} func={handleButton}/>
          
        </>
      );
}