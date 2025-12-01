import "./css/main.css";
import { TableGet } from "./table.jsx";
import { useContext } from "react";
import { ContextGlobal } from "../context/globalContext.jsx";
import { Link } from "react-router-dom";
import ventasImg from "./icons/icons8-ventas-totales-94.png";
import gastosImg from "./icons/icons8-spend-64.png";
import inventarioImg from "./icons/icons8-boxes-96.png";
import trasladosImg from "./icons/icons8-mover-por-carretilla-60.png";
import ingresosImg from "./icons/icons8-lista-64.png";
import productosImg from "./icons/icons8-búsqueda-94.png";

const Card = ({title, colorCard, link, img}) => {
    return(
        <Link className="home_card" style={{"backgroundColor": `${colorCard}`}} to={link}>
            <div className="container_img_card_home">
                <img src={img} alt=""/>
            </div>
    
            <p>{title}</p>
        </Link>
    )
}

export const Landing = () => {
    
    const {urlGlobal} = useContext(ContextGlobal)
    return(
        <>
        
        <div className="container_landing">
            <Card title={'Ventas'} colorCard={'yellow'} link={'/searchSales'} img={ventasImg}/>
            {/* <Card title={'Compras'} colorCard={'skyblue'} link={'/searchSales'}/> */}
            <Card title={'Gastos'} colorCard={'#f21d1d'} link={'/searchSpends'} img={gastosImg}/>
            {/* <Card title={'Proveedores'} colorCard={'grey'} link={'/searchSales'}/> */}
            <Card title={'Traslados'} colorCard={'#284bd7'} link={'/lastTransactions'} img={trasladosImg}/>
            <Card title={'Inventario'} colorCard={'#ff4400'} link={'/inventory'} img={inventarioImg}/>

            <Card title={'Ingresos'} colorCard={'#40ea22'} link={'/lastEntries'} img={ingresosImg}/>
            <Card title={'Producto Vendido'} colorCard={'#00b4ff'} link={'/sumSalesMonthly'} img={productosImg}/>

        </div>
        <h3>Ultimas cinco: </h3>
        <TableGet url={`${urlGlobal}/api/v1/ventas`} />
        </>
        
    )
}