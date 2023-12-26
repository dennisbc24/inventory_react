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
          <a href="https://inventario.elwayardo.com">Registrar Venta</a>
          <ul>
            <li>hola</li>
            <li>hola</li>/*  */
            <li>hola</li>
          </ul>
        </li>
        <li className="pestaña"><a href="https://inventario.elwayardo.com/nuevo_producto">Nuevo Producto</a></li>
        <li className="pestaña"><a href="https://inventario.elwayardo.com/ventas_por_fecha">Buscar Ventas</a></li>
        <li className="pestaña"><a href="https://inventario.elwayardo.com/actualizar_producto">Actualizar Producto</a></li>
        <li className="pestaña"><a href="https://inventario.elwayardo.com/gastos">Registrar Gasto</a></li>
        <li className="pestaña"><a href="https://inventario.elwayardo.com/summaries">Resumenes</a></li>
        

      </ul>
    </header>
    )
    
    
}



