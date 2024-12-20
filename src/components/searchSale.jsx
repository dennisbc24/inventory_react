import  { useState, useEffect } from "react";
import {  ButtonSave, InputSimple, SearchInput} from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import {  TableGet2 } from "./table.jsx";

import { SalesService } from "../services/sales.js";
const saleService = new SalesService()

const SearchByProduct=({urlBase})=>{
     const [show, setShow] = useState(false);
     const [product, setProduct] = useState({name:'nulo', id_product:1})
     const [data2, setData2] = useState([]);
  
     useEffect(()=>{
  setShow(false)
  }, [product])
  
  const getData = async () => {
    
    const data = await saleService.getByProduct(urlBase,product.id_product)
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
}

const SearchByDate= ({url}) => {
  
  const [date, setDate] = useState(0);
  const [show, setShow] = useState(false);

  const handleDate = ({ target: { value } }) => { setDate(value), setShow(false)};
  const handleButton = () => {setShow(true)};
  return (
    <>
    <div className="divForm">
            <InputSimple titulo="Fecha" tipo="date" func={handleDate}></InputSimple>
    </div>
    <ButtonSave titulo={"Buscar"} func={handleButton}/>
     
      
    {<>{ show ? <TableGet url={`${url}/api/v1/ventas/salesByDate?date=${date}`} minWitdh="800px"/> : <></>
    }</>}
    </>
  );
};

export const SearchSale = ({urlBase}) => {
const [option, setOption] = useState(1)

const handleOption = (e)=>{
  const value = parseInt(e.target.value)
     setOption(value)
}
return(



<>
    <TitleForm text='Buscar Ventas Por:'></TitleForm>
    <select onChange={handleOption}>
      <option value="1">Fecha</option>
      <option value="2">Producto</option>
    </select>
    {option === 1 && <SearchByDate url={urlBase} />}
    {option === 2 && <SearchByProduct urlBase={urlBase}/>}

</>)
  
};
