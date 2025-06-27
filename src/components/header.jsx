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
      <Pestana titulo='Ventas'>
        {usuario.role === 'admin' || usuario.role === 'seller' ? <EnlaceLi name='Registrar' link='/putSale'/> : null}
        { usuario.role === 'admin' || usuario.role === 'viewer' ? <EnlaceLi name='Buscar Venta' link='/searchSales'/> : null}
        { usuario.role === 'admin' ? <EnlaceLi name ='Eliminar' link='/deleteSale'/> : null}
        { usuario.role === 'admin' || usuario.role === 'viewer' ? <EnlaceLi name='Suma Mensual' link='/sumSalesMonthly'/> : null}
      </Pestana>

      <Pestana titulo='Productos'>
          { usuario.role === 'admin' || usuario.role === 'viewer' ? <EnlaceLi name='Ver' link='/products'/> : null}
          { usuario.role === 'admin' ? <EnlaceLi name='Crear' link='/newProduct'/> : null}
          { usuario.role === 'admin' ? <EnlaceLi name='Editar' link='/updateProduct'/> : null}
           {/* <EnlaceLi name='Borrar'/> */}
      </Pestana>
      <Pestana titulo='Stock'>
        { usuario.role === 'admin' ? <EnlaceLi name='Ingresos' link='/entries'/> : null}
        { usuario.role === 'admin' || usuario.role === 'viewer' ? <EnlaceLi name='Inventario'link='/inventory'/> : null}
        { usuario.role === 'admin' || usuario.role === 'seller' ? <EnlaceLi name='Transacciones' link='/transactions'/> : null}
        { usuario.role === 'admin' || usuario.role === 'viewer' ? <EnlaceLi name='Buscar' link='/inventorySearch'/> : null} 
        { usuario.role === 'admin' ? <EnlaceLi name='Editar' link='/existenceCount'/> : null} 
        {/* <EnlaceLi name='Borrar'/> */}
      </Pestana>
      <Pestana titulo='Otros'>
        { usuario.role === 'admin' || usuario.role === 'seller' ? <EnlaceLi name='Gastos' link='/expense'/> : null}
        { usuario.role === 'admin' || usuario.role === 'viewer' ? <EnlaceLi name='Buscar Gasto' link='/searchSpends'/> : null}
        { usuario.role === 'admin' ? <EnlaceLi name='Caja' link='/box'/> : null}
         {/* <EnlaceLi name='Resumen'/> */}
         {/* <EnlaceLi name='Buscar Resumen' link='/summaries'/> */}
      </Pestana>
      </ul>
    </header>
  );
}


