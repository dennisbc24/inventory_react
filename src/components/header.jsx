import "./menu.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import close from "./icons/close.png";
import menu from "./icons/menu.png";
import repartidor from "./icons/repartidor.png";

export function Menu({ children, titulo }) {
  const [check, setCheck] = useState(true);
  const [cerrar, setCerrar] = useState('-100%')

  useEffect(()=>{
    check ? setCerrar('-100%') : setCerrar('0')
  }, [check])
  
  const change = () => {
    setCheck(!check);
    setCerrar('0')
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

      <ul style={{right:`${cerrar}`}} className="caja_pestañas">{children}</ul>
    </header>
  );
}

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

export function EnlaceLi({ name, link = "#" }) {
  return (
    <li className="dropDown_li">
      <Link className="dropDown_a" to={link}>
        {name}
      </Link>
    </li>
  );
}
