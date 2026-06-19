import "./css/main.css";
import { useContext, useEffect, useState } from "react";
import { ContextGlobal } from "../context/globalContext.jsx";
import { Link } from "react-router-dom";
import gastosImg from "./icons/icons8-spend-64.png";
import trasladosImg from "./icons/icons8-mover-por-carretilla-60.png";
import ingresosImg from "./icons/icons8-lista-64.png";
import car from "./icons/icons8-carrito-de-compras-50.png";
import flecha_abajo from "./icons/flecha_abajo.png";
import flecha_arriba from "./icons/flecha_arriba.png";
import home from "./icons/home.png";
import ventas from "./icons/footer_carrito.png";
import inventario from "./icons/footer_inventario.png";
import movimientos from "./icons/footer_flujo.png";
import alerta from "./icons/footer_alerta.png";
import { SalesService } from "../services/sales.js";
import {InventoryService} from "../services/inventory.js";
import {SalesChart} from "./graph/graph.jsx";
const salesService = new SalesService();
const inventoryService = new InventoryService();

const Card = ({title, colorCard, link, paragraph}) => {
    return(
        <Link className="home_card" style={{"backgroundColor": `${colorCard}`}} to={link}>
            <div className="container_img_card_home">
               
            </div>
            <div className="home_card_content">
            <h3>{title}</h3>
            <p>{paragraph}</p>
            </div>
            
        </Link>
    )
}

const Product_Card = ({productosImg, img, title, description, link}) =>{
return(
    <Link className="sumaries_products_home" to={link}>
                <div className="product_summary_card">
                    <img src={productosImg} />
                    <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                </div>
                <img src={img}/>
        </Link> 
)
}


const Summary_Card = ({img, title, description,color, link}) =>{
    return(
        <Link className="sumaries_home_card" to={link}>
                <img src={img} style={{"backgroundColor": `${color}`}}/>
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
        </Link> 
    )
}

const Footer_Card = ({image,title}) => {
    return(
<div className="footer_card">
                <img src={image}/>
                                <p>{title}</p>

            </div>
    )
}
export const Landing = () => {
    const [saleOfTheDay, setSaleOfTheDay] = useState(0);
    const [revenueOfTheDay, setRevenueOfTheDay] = useState(0);
    const [valueInventory, setValueInventory] = useState(0);
    const [sellingProducts, setSellingProducts] = useState([]);
   // const [inventoryValueByProduct, setInventoryValueByProduct] = useState([]);
    const [stocvkLow, setStockLow] = useState([]);
useEffect(() => {
    const fetchSalesOfTheDay = async () => {
        const totalSales = await salesService.getSalesOfTheDay(urlGlobal);
        setSaleOfTheDay(totalSales); 
    };
    fetchSalesOfTheDay();
}, []);
useEffect(() => {
    const fetchRevenueOfTheDay = async () => {
        const revenue = await salesService.getRevenueOfTheDay(urlGlobal);
        setRevenueOfTheDay(revenue); 
    };
    fetchRevenueOfTheDay();
}, []);

useEffect(() => {
    const topSelling = async () => {
        const topSelling = await salesService.getTopSellingProducts(urlGlobal);
        setSellingProducts(topSelling);         
    };
    topSelling();
}, []);
useEffect(() => {    const stockLow = async () => {
        const stockLow = await inventoryService.getStockLow(urlGlobal);
        setStockLow(stockLow);         
    };
    stockLow();
}, []);
useEffect(() => {
    const fetchInventoryValue = async () => {
        const inventoryValue = await inventoryService.getValuesInventory(urlGlobal);
        setValueInventory(inventoryValue); 
    };  
    fetchInventoryValue();
}, []);
// useEffect(() => {
//     const fetchInventoryValueByProduct = async () => {
//         const inventoryValue = await inventoryService.getInventoryValueByProduct(urlGlobal);
//         setInventoryValueByProduct(inventoryValue); 
        
        
//     };  
//     fetchInventoryValueByProduct();
// }, []);


    const {urlGlobal} = useContext(ContextGlobal)
    return(
        <>
        <main>
<div className="container_landing">
            <Card title={'Ventas Hoy'} colorCard={'blue'} link={'/searchSales'} paragraph={`S/.${saleOfTheDay}`} />
            {/* <Card title={'Compras'} colorCard={'skyblue'} link={'/searchSales'}/> */}
            <Card title={'Valor Inventario'} colorCard={'green'} link={'/inventory'} paragraph={`S/.${valueInventory}`}/>
            {/* <Card title={'Proveedores'} colorCard={'grey'} link={'/searchSales'}/> */}
            <Card title={'Ganancia Hoy'} colorCard={'red'} link={'/searchSales'} paragraph={`S/.${revenueOfTheDay}`} />
            <Card title={'Traslados'} colorCard={'purple'} link={'/lastTransactions'} paragraph={'0 Operaciones'} />

            {/* <Card title={'Ingresos'} colorCard={'#40ea22'} link={''} />
            <Card title={'Producto Vendido'} colorCard={'#00b4ff'} link={''}/> */}

        </div>
            <Product_Card title={'Productos populares'} description={sellingProducts[0]?.producto || 'No hay datos'} img={flecha_arriba} productosImg={sellingProducts[0]?.img || ''}/>
            <Product_Card img={flecha_abajo} title={'Stock bajo'} description={
                stocvkLow[Math.floor(Math.random() * stocvkLow.length)]?.nombre|| 'No hay datos'}/>
        <section className="summaries_card">
            <Summary_Card img={car} title={'Registro de venta'} description={'Registrar'} color={'green'} link={'/putSale'}/>
            <Summary_Card img={ingresosImg} title={'Añadir ingreso'} description={'ingreso'} color={'#220080'} link={'/entries'}/>
            <Summary_Card img={gastosImg} title={'Registrar Gasto'} description={'Registrar'} color={'red'} link={'/expense'}/>
            <Summary_Card img={trasladosImg} title={'Realizar traslado'} description={'Traslado'} color={'#ff5b1d'} link={'/transactions'}/>
        </section>    
        
        <section>
            <h3>Reporte de ventas</h3>
            
            <div className="graph">            <SalesChart urlBase={urlGlobal}/>   </div>
        </section>
        
        
        {/* <h3>Ultimas cinco: </h3>
        <TableGet url={`${urlGlobal}/api/v1/ventas`} /> */}
        </main>
        

        <footer>
            
            <Footer_Card image={home} title={'Dashboard'} />
            <Footer_Card image={ventas} title={'Ventas'} />
            <Footer_Card image={inventario} title={'Inventario'} />
            <Footer_Card image={movimientos} title={'Movimientos'} />
            <Footer_Card image={alerta} title={'Notificaciones'}/>

        </footer>
        </>
        
    )
}