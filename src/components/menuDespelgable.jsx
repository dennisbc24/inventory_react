import React from 'react'
import ReactDOM from 'react-dom/client'
/* import './index.css' */
import {Menu,Pestana,EnlaceLi} from './header.jsx'


export function MainMenu() {
    return(
<Menu titulo='Ventas'>

<Pestana titulo='Ventas'>
   <EnlaceLi name='Registrar' link='/'/>
   <EnlaceLi name='Buscar Venta' link='/searchSales'/>
   <EnlaceLi name='Eliminar' link='/deleteSale'/>
</Pestana>
<Pestana titulo='Productos'>
   <EnlaceLi name='Nuevo' link='/newProduct'/>
   {/* <EnlaceLi name='Actualizar'/> */}
   {/* <EnlaceLi name='Borrar'/> */}
</Pestana>
<Pestana titulo='Stock'>
   <EnlaceLi name='Ingreso' link='/entries'/>
   {/* <EnlaceLi name='Inventario'/> */}
   {/* <EnlaceLi name='Transacciones'/> */}
   {/* <EnlaceLi name='Borrar'/> */}
</Pestana>
<Pestana titulo='Otros'>
   <EnlaceLi name='Registrar Gasto' link='/expense'/>
   {/* <EnlaceLi name='Buscar Gasto'/> */}
   {/* <EnlaceLi name='Resumen'/> */}
   {/* <EnlaceLi name='Buscar Resumen'/> */}
</Pestana>
 
</Menu>
    )
    
}



