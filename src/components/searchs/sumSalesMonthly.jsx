import "../salesForm.css";
import { TitleForm } from "../form/titleForm.jsx";
import {  ButtonSave, InputSimple, SearchInput} from "../form/inputSearch";
import { useEffect, useState } from "react";
import { TableGet, TableGet2 } from "../table.jsx";
import { SalesService } from "../../services/sales.js";
const saleService = new SalesService()

export const Monthly = ({urlBase}) => {
  
  
   const [show, setShow] = useState(false);
   const [product, setProduct] = useState({name:'nulo', id_product:1})
   const [data2, setData2] = useState([]);


useEffect(()=>{
setShow(false)
}, [product])

const getData = async () => {
  
  const data = await saleService.getSumMonthly(urlBase,product.id_product)
  setData2(data)
  if (data.length != 0) {
    /* const sumar = 
    data.map((ele)=>{
      
    }) */
    setShow(true)
  }
  
};


  return (
    <>
    <TitleForm text='Buscar Ventas'></TitleForm>
    <p>{product.name}</p>
    <div className="divForm">
        <SearchInput urlApi={`${urlBase}/api/v1/products`} funcSet={setProduct} place="Buscar Producto"/>
            
    </div>
    <ButtonSave titulo={"Buscar"} func={getData}/>
     
    {<>{ show ? <TableGet2 respJson={data2} minWitdh="600px"/> : <></>
    }</>}
    </>
  );
};