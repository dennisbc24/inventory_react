import  { useState } from "react";
import {  ButtonSave, InputSimple} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet } from "./table.jsx";

export const SearchSale = ({urlBase}) => {
  
  const [date, setDate] = useState(0);
  const [show, setShow] = useState(false);

  const handleDate = ({ target: { value } }) => { setDate(value), setShow(false)};
  const handleButton = () => {setShow(true)};
  return (
    <>
    <TitleForm text='Buscar Ventas'></TitleForm>
    <div className="divForm">
            <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple>
    </div>
    <ButtonSave titulo={"Buscar"} func={handleButton}/>
     
      
    {<>{ show ? <TableGet url={`${urlBase}/api/v1/ventas/salesByDate?date=${date}`} minWitdh="800px"/> : <></>
    }</>}
    </>
  );
};
