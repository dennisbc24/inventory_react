import "../salesForm.css";
import { TitleForm } from "../form/titleForm.jsx";
import {  ButtonSave, InputSimple, SearchInput} from "../form/inputSearch";
import { useEffect, useState } from "react";
import { TableGet } from "../table.jsx";


export const Monthly = ({urlBase}) => {
  
  
   const [show, setShow] = useState(false);
   const [product, setProduct] = useState({name:'nulo'})

useEffect(()=>{
setShow(false)
}, [product])

const getData = () => {setShow(true)};


  return (
    <>
    <TitleForm text='Buscar Ventas'></TitleForm>
    <p>{product.name}</p>
    <div className="divForm">
        <SearchInput urlApi={`${urlBase}/api/v1/products`} funcSet={setProduct} />
            
    </div>
    <ButtonSave titulo={"Buscar"} func={getData}/>
     
      
    {<>{ show ? <TableGet url={`${urlBase}/api/v1/ventas/salesMonthly?fk_id_product=${product.id_product}`} minWitdh="800px"/> : <></>
    }</>}
    </>
  );
};