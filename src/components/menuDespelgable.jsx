import React from 'react'
import ReactDOM from 'react-dom/client'
/* import './index.css' */
import {Menu,Pestana,EnlaceLi} from './header.jsx'


export function MainMenu() {
    return(
<Menu titulo='Ventas'>

<Pestana titulo='Ventas'>
   <EnlaceLi name='Registrar' link='/'/>
   <EnlaceLi name='Buscar Venta'/>
   <EnlaceLi name='Eliminar'/>
</Pestana>
<Pestana titulo='Productos'>
   <EnlaceLi name='Nuevo' link='/newProduct'/>
   <EnlaceLi name='Actualizar'/>
   <EnlaceLi name='Borrar'/>
</Pestana>
<Pestana titulo='Stock'>
   <EnlaceLi name='Ingreso'/>
   <EnlaceLi name='Inventario'/>
   <EnlaceLi name='Transacciones'/>
   <EnlaceLi name='Borrar'/>
</Pestana>
<Pestana titulo='Otros'>
   <EnlaceLi name='Gastos'/>
   <EnlaceLi name='Buscar Gasto'/>
   <EnlaceLi name='Resumen'/>
   <EnlaceLi name='Buscar Resumen'/>
</Pestana>
 
</Menu>
    )
    
}



