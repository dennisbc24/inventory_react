import React from 'react'
import ReactDOM from 'react-dom/client'
/* import './index.css' */
import {Menu,Pestana,EnlaceLi} from './header.jsx'


export function MainMenu() {
    return(
<Menu titulo='Ventas'>

<Pestana titulo='Ventas'>
   <EnlaceLi name='Registrar'/>
   <EnlaceLi name='ver'/>
   <EnlaceLi name='eliminar'/>
</Pestana>
<Pestana titulo='Productos'>
   <EnlaceLi name='actualizar'/>
   <EnlaceLi name='revisar'/>
   <EnlaceLi name='delete'/>
</Pestana>
 
</Menu>
    )
    
}



