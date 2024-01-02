import './menu.css'
import {useState} from 'react'

export function Menu({children,titulo}) {

  
    return (
        <header>
    
      <input type="checkbox" name="" id="boton-menu" className="boton-menu"/>
      <label htmlFor="boton-menu" className="boton-check">
        <p>menu</p>
        <img src="../icons/menu.png" alt="" className="boton_open"/>
        <img src="../icons/close.png" alt="" className="boton_close"/>
      </label>
      
      <div className="caja-logo">
        <img src="../icons/repartidor.png" alt="" className="logito"/>
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


export function EnlaceLi({name}) {
  return(
    <li className='dropDown_li'><a className='dropDown_a' href='#'>{name}</a></li>
  )
  
}



