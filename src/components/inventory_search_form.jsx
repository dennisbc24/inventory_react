import { useState } from "react";
import { ButtonSave, InputSimple} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet } from "./table.jsx";

export const InventorySearchForm = ({urlBase}) => {
  
  const [keyWord, setKeyWord] = useState('');
  const [show, setShow] = useState(false);
     
  const handleInput = ({ target: { value } }) => { setKeyWord(value), setShow(false)};
  const handleButton = () => {setShow(true)};
  return (
    <>
    <TitleForm text='Buscar Stock de Producto'></TitleForm>
    <div className="divForm">
        <InputSimple func={handleInput} />
    </div>
    <ButtonSave titulo={"Buscar"} func={handleButton}></ButtonSave>
      
    {<>{ show ? <TableGet url={`${urlBase}/api/v1/existence/byName?keyWord=${keyWord}`} minWitdh="380px"/> : <></>
    }</>}
    </>
  );
};