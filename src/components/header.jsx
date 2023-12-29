import './header.css'

export function Header(params) {
    
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
        <li className="pestaña">
          <a className='pestana_a' href="https://inventario.elwayardo.com">Home</a>
        
        </li>
        <li className="pestaña"><a className='pestana_a' href="https://inventario.elwayardo.com/nuevo_producto">Gastos</a></li>
        <li className="pestaña"><a className='pestana_a' href="https://inventario.elwayardo.com/ventas_por_fecha">Ventas</a>
        <ul className='dropDown'>
          <li className='dropDown_li'><a className='dropDown_a' href="#">Registrar venta</a></li>
          <li className='dropDown_li'><a className='dropDown_a' href="#">Borrar venta</a></li>
          <li className='dropDown_li'><a className='dropDown_a' href="#">Ver ventas</a></li>
          <li className='dropDown_li'><a className='dropDown_a' href="#">Registrar venta</a></li>
        </ul>
        </li>
        <li className="pestaña"><a className='pestana_a' href="https://inventario.elwayardo.com/actualizar_producto">Productos</a></li>
        <li className="pestaña"><a  className='pestana_a'href="https://inventario.elwayardo.com/gastos">Inventario</a></li>
        <li className="pestaña"><a className='pestana_a' href="https://inventario.elwayardo.com/summaries">Resumenes</a></li>
        

      </ul>
    </header>
    )
    
    
}



