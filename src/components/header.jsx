import "./menu.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import close from "./icons/close.png";
import menu from "./icons/menu.png";
import repartidor from "./icons/repartidor.png";
import { ContextUser } from "../context/userContext";

export function Pestana({ children, titulo }) {
  const [vista, setVista] = useState("close");
  const classDropDown =
    vista == "close" ? "dropDown dropDownClose" : "dropDown";

  function witch() {
    const changeView =
      vista == "close" ? setVista("abierto") : setVista("close");
  }

  return (
    <li className="pestaña" onClick={witch}>
      {titulo}
      <ul className={classDropDown}>{children}</ul>
    </li>
  );
}

export function EnlaceLi({ name, link = "#", func }) {
  return (
    <li className="dropDown_li" onClick={func}>
      <Link className="dropDown_a" to={link}>
        {name}
      </Link>
    </li>
  );
}

export function Menu() {
  const {usuario} = useContext(ContextUser)
  const [check, setCheck] = useState(true);
  const [cerrar, setCerrar] = useState('-100%')

  useEffect(()=>{
    check ? setCerrar('-100%') : setCerrar('0')
  }, [check])
  
  const change = () => {
    setCheck(!check);
    setCerrar('0')
  };

  const change2 = (e) => {
    
    if (e.target.className === 'dropDown_a') {
      setCheck(!check);
    setCerrar('0')
    }
    
  };
  return (
    <header>
      <div className="boton-check">
        <Link to='/'><p>INICIO</p></Link>
        {
          <>
            {check ? (
              <img src={menu} alt="" className="boton_open" onClick={change} />
            ) : (
              <img
                src={close}
                alt=""
                className="boton_close"
                onClick={change}
              />
            )}
          </>
        }
      </div>

      <div className="caja-logo">
        <img src={repartidor} alt="" className="logito" />
        <a href="https://inventario.elwayardo.com/" className="main_title">
          El Wayardo
        </a>
      </div>

      <ul style={{right:`${cerrar}`}} className="caja_pestañas" onClick={change2}>
        {usuario.role === 'admin' || usuario.role === 'seller' ? <Pestana titulo='VER'>
          <EnlaceLi name='Ventas' link='/searchSales'/>
          <EnlaceLi name='Precios'link='/inventory'/>
          <EnlaceLi name='Productos' link='/products'/>
          <EnlaceLi name='Suma Mensual' link='/sumSalesMonthly'/>
          <EnlaceLi name='Buscar Stock' link='/inventorySearch'/>
          <EnlaceLi name='Buscar Gasto' link='/searchSpends'/>
        </Pestana> : null}
        {usuario.role === 'viewer' ? 
        <>
        <EnlaceLi name='VENTAS' link='/searchSales'/>
          <EnlaceLi name='PRECIOS'link='/inventory'/>
          <EnlaceLi name='PRODUCTOS' link='/products'/>
          <EnlaceLi name='SUMA MENSUAL' link='/sumSalesMonthly'/>
          <EnlaceLi name='BUSCAR STOCK' link='/inventorySearch'/>
          <EnlaceLi name='BUSCAR GASTO' link='/searchSpends'/> 
        </>
          : null}
    {usuario.role === 'admin' || usuario.role === 'seller' ? <Pestana titulo='Registrar'>
      {usuario.role === 'admin' || usuario.role === 'seller' ? <EnlaceLi name='Venta' link='/putSale'/> : null}
          { usuario.role === 'admin' ? <EnlaceLi name='Producto' link='/newProduct'/> : null}
          { usuario.role === 'admin' || usuario.role === 'seller' ? <EnlaceLi name='Gasto' link='/expense'/> : null}
          { usuario.role === 'admin' ? <EnlaceLi name='Ingreso' link='/entries'/> : null}
        { usuario.role === 'admin' || usuario.role === 'seller' ? <EnlaceLi name='Traslado' link='/transactions'/> : null}
      </Pestana> : null}

      {usuario.role === 'admin' ? <Pestana titulo='Editar'>
{ usuario.role === 'admin' ? <EnlaceLi name='Stock' link='/existenceCount'/> : null} 
        { usuario.role === 'admin' ? <EnlaceLi name ='Eliminar Venta' link='/deleteSale'/> : null}
        { usuario.role === 'admin' ? <EnlaceLi name='Producto' link='/updateProduct'/> : null}
      </Pestana>: null}
      
      {/* <Pestana titulo='Otros'>
        { usuario.role === 'admin' ? <EnlaceLi name='Caja' link='/box'/> : null}
         
      </Pestana> */}
      </ul>
    </header>
  );
}


