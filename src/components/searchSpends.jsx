import { useState } from "react";
import {  ButtonSave, InputSimple} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet } from "./table.jsx";

export const SearchSpends = ({urlBase, token}) => {
  
  const [date, setDate] = useState(0);
  const [show, setShow] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const handleDate = ({ target: { value } }) => { 
    setDate(value), 
    setShow(false),
    console.log(date);
    setYear(value.substring(0, 4)),
    setMonth(value.substring(5, 7))  
};
  const handleButton = () => {setShow(true)};

  
  
  return (
    <>
    <TitleForm text='Buscar Gastos'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="Fecha" tipo="month" func={handleDate}></InputSimple>
    </div>
    <ButtonSave titulo={"Buscar"} func={handleButton}/>
     
      
    {<>{ show ? <TableGet url={`${urlBase}/api/v1/box/byMonth?year=${year}&month=${month}`} token={token}/> : <></>
    }</>}
    </>
  );
};
