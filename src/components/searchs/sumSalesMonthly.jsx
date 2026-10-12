import "../salesForm.css";
import { TitleForm } from "../form/titleForm.jsx";
import { SearchInput } from "../form/inputSearch";
import { useEffect, useState } from "react";
import { TableGet2, TABLE_HEADERS } from "../table.jsx";
import { SalesService } from "../../services/sales.js";
const saleService = new SalesService()

export const Monthly = ({urlBase}) => {


   const [product, setProduct] = useState({name:'', id_product:0})
   const [data2, setData2] = useState([]);


useEffect(()=>{
  if (product.id_product) getData();
}, [product])

const getData = async () => {

  const data = await saleService.getSumMonthly(urlBase,product.id_product)
  setData2(data || [])

};


  return (
    <>
    <TitleForm text='Buscar Ventas'></TitleForm>
    <p>{product.name || 'Selecciona un producto...'}</p>
    <div className="divForm">
        <SearchInput urlApi={`${urlBase}/api/v1/products`} funcSet={setProduct} place="Buscar Producto"/>

    </div>

    {<>{ data2.length > 0 ? <TableGet2 respJson={data2} minWitdh="600px" headers={TABLE_HEADERS.salesMonthly}/> : <></>
    }</>}
    </>
  );
};
