import './menu.css'
import {useState} from 'react'
import { Link } from "react-router-dom";
import close from './icons/close.png';
import menu from './icons/menu.png';
import repartidor from './icons/repartidor.png';


export function Menu({children,titulo}) {
      return (
        <header>
    
      <input type="checkbox" name="" id="boton-menu" className="boton-menu"/>
      <label htmlFor="boton-menu" className="boton-check">
        <p>menu</p>
        <img src={menu} alt="" className="boton_open"/>
        <img src={close} alt="" className="boton_close"/>
      </label>
      
      <div className="caja-logo">
        <img src={repartidor} alt="" className="logito"/>
        <a href="#" className="main_title">El Wayardo</a>
      </div>
      
      <ul className="caja_pestañas">
        
        {children}
        
        

      </ul>
    </header>
    )    
}


export function Pestana({children,titulo}) {

  const [vista, setVista] = useState('close')
  const classDropDown = vista=='close' ? 'dropDown dropDownClose' : 'dropDown'
    
  function witch() {
    const changeView = vista=='close' ? setVista('abierto') : setVista('close')
  }

  return(
    <li className="pestaña" onClick={witch}>
          {titulo}
          <ul className={classDropDown}>
            
            {children}
          </ul>
        </li>
  )
}


export function EnlaceLi({name,link='#'}) {
  return(
    <li className='dropDown_li'><Link className='dropDown_a' to={link}>{name}</Link></li>
  )
  
}



