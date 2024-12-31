import "./menu.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import close from "./icons/close.png";
import menu from "./icons/menu.png";
import repartidor from "./icons/repartidor.png";

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
        <p>menu</p>
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
         <EnlaceLi name='Registrar' link='/putSale'/>
         <EnlaceLi name='Buscar Venta' link='/searchSales'/>
         <EnlaceLi name='Eliminar' link='/deleteSale'/>
         <EnlaceLi name='Suma Mensual' link='/sumSalesMonthly'/>

      </Pestana>
      <Pestana titulo='Productos'>
        
        <EnlaceLi name='Ver' link='/products'/>
         <EnlaceLi name='Crear' link='/newProduct'/>
         <EnlaceLi name='Editar' link='/updateProduct'/>
         {/* <EnlaceLi name='Borrar'/> */}
      </Pestana>
      <Pestana titulo='Stock'>
         <EnlaceLi name='Ingresos' link='/entries'/>
         <EnlaceLi name='Inventario'link='/inventory'/>
         <EnlaceLi name='Transacciones' link='/transactions'/>
         <EnlaceLi name='Buscar' link='/inventorySearch'/>
         <EnlaceLi name='Editar' link='/existenceCount'/>
         {/* <EnlaceLi name='Borrar'/> */}
      </Pestana>
      <Pestana titulo='Otros'>
         <EnlaceLi name='Registrar' link='/expense'/>
         <EnlaceLi name='Buscar Gasto' link='/searchSpends'/>
         <EnlaceLi name='Caja' link='/box'/>
         {/* <EnlaceLi name='Resumen'/> */}
         {/* <EnlaceLi name='Buscar Resumen' link='/summaries'/> */}
      </Pestana>
      </ul>
    </header>
  );
}


