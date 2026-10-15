import { useState } from "react";
import {  InputSimple,  SelectSimple} from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import "./css/compactForm.css";
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
      await axios.post(urlUpload,{
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

    const handleClear = () => {
      setConcept(''); setDate(''); setAmount(0); setUser(1); setType('true');
      const form = document.querySelector('form'); if(form) form.reset();
    };

    return (
        <>
        <main>
<TitleForm text='Salidas de dinero'></TitleForm>
          
          <form onSubmit={(e)=>{e.preventDefault(); handleButton();}}>
          <InputSimple titulo="Monto" tipo="number" step="any" func={handleMount} callToAction="Cuánto fue?" className="compact"></InputSimple>
          <InputSimple titulo="Concepto" tipo="text" func={handleConcept} callToAction="Para qué fue?" className="compact"></InputSimple>
          <InputSimple titulo="Fecha" tipo="date" func={handleDate} className="compact"></InputSimple>
          <SelectSimple titulo="Usuario" func={handleUser} className="compact">
              <option value="1">Dennis</option>
              <option value="2">Luz Marina</option>
              <option value="3">Miguel Ángel</option>
            </SelectSimple>
            <SelectSimple titulo="Tipo"func={handleType} className="compact">
              <option value="true">Gasto</option>
              <option value="false">Mercadería</option>
              
            </SelectSimple>
          <div className="form_actions">
            <button type="submit" className="btn_primary">Guardar</button>
            <button type="button" className="btn_clear" onClick={handleClear}>Limpiar</button>
          </div>
          </form>
        </main>
        
          
        </>
      );
}