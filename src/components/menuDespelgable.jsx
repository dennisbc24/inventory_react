import React from 'react'
import ReactDOM from 'react-dom/client'
/* import './index.css' */
import {Menu,Pestana,EnlaceLi} from './header.jsx'


export function MainMenu() {
    return(
<Menu titulo='Ventas'>

<Pestana titulo='Ventas'>
   <EnlaceLi name='Registrar' link='/putSale'/>
   <EnlaceLi name='Buscar Venta' link='/searchSales'/>
   <EnlaceLi name='Eliminar' link='/deleteSale'/>
</Pestana>
<Pestana titulo='Productos'>
   <EnlaceLi name='Nuevo' link='/newProduct'/>
   <EnlaceLi name='Actualizar' link='/updateProduct'/>
   {/* <EnlaceLi name='Borrar'/> */}
</Pestana>
<Pestana titulo='Stock'>
   <EnlaceLi name='Ingreso' link='/entries'/>
   <EnlaceLi name='Inventario'link='/inventory'/>
   <EnlaceLi name='Transacciones' link='/transactions'/>
   <EnlaceLi name='Buscar' link='/inventorySearch'/>
   <EnlaceLi name='Actualizar Stock' link='/existenceCount'/>
   {/* <EnlaceLi name='Borrar'/> */}
</Pestana>
<Pestana titulo='Otros'>
   <EnlaceLi name='Registrar Gasto' link='/expense'/>
   <EnlaceLi name='Buscar Gasto' link='/searchSpends'/>
   {/* <EnlaceLi name='Resumen'/> */}
   {/* <EnlaceLi name='Buscar Resumen' link='/summaries'/> */}
</Pestana>
 
</Menu>
    )
    
}



