import "./css/main.css";
import { useContext, useEffect, useState } from "react";
import { ContextGlobal } from "../context/globalContext.jsx";
import { Link } from "react-router-dom";
import gastosImg from "./icons/icons8-spend-64.png";
import trasladosImg from "./icons/icons8-mover-por-carretilla-60.png";
import ingresosImg from "./icons/icons8-lista-64.png";
import car from "./icons/icons8-carrito-de-compras-50.png";

import home from "./icons/home.png";
import ventas from "./icons/footer_carrito.png";
import inventario from "./icons/footer_inventario.png";
import movimientos from "./icons/footer_flujo.png";
import alerta from "./icons/footer_alerta.png";
import { SalesService } from "../services/sales.js";
import {InventoryService} from "../services/inventory.js";
import {SalesChart} from "./graph/graph.jsx";
import shoppingService from "../services/shoppingList.js";
import noImagen from "./img/no_imagen.png";
const salesService = new SalesService();
const inventoryService = new InventoryService();

const Card = ({title, colorCard, link, paragraph}) => {
    return(
        <Link className="home_card" style={{"--card-accent": `${colorCard}`}} to={link}>
            <div className="container_img_card_home">
               
            </div>
            <div className="home_card_content">
            <h3>{title}</h3>
            <p>{paragraph}</p>
            </div>
            
        </Link>
    )
}

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#f59e0b" style={{ flexShrink: 0 }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const AlarmIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#dc2626" style={{ flexShrink: 0 }}>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const Product_Card = ({productosImg, img, icon, title, description, link}) =>{
return(
    <Link className="sumaries_products_home" to={link}>
                <div className="product_summary_card">
                    <img src={productosImg} />
                    <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                </div>
                {icon || <img src={img}/>}
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

const Footer_Card = ({image,title, link}) => {
    return(
<Link className="footer_card" to={link}>
                <img src={image}/>
                                <p>{title}</p>
</Link>
            )
}
export const Landing = () => {
    const [saleOfTheDay, setSaleOfTheDay] = useState(0);
    const [revenueOfTheDay, setRevenueOfTheDay] = useState(0);
    const [valueInventory, setValueInventory] = useState(0);
    const [sellingProducts, setSellingProducts] = useState([]);
   // const [inventoryValueByProduct, setInventoryValueByProduct] = useState([]);
    const [stocvkLow, setStockLow] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [shopIdx, setShopIdx] = useState(0);
useEffect(() => {
    const fetchShoppingList = async () => {
        try {
            const data = await shoppingService.getList(urlGlobal);
            setShoppingItems(data || []);
        } catch (e) { console.error(e); }
    };
    fetchShoppingList();
}, []);
useEffect(() => {
    if (shoppingItems.length <= 1) return;
    const t = setInterval(() => setShopIdx((i) => (i + 1) % shoppingItems.length), 4000);
    return () => clearInterval(t);
}, [shoppingItems]);
const [sellIdx, setSellIdx] = useState(0);
useEffect(() => {
    if (sellingProducts.length <= 1) return;
    const t = setInterval(() => setSellIdx((i) => (i + 1) % sellingProducts.length), 4000);
    return () => clearInterval(t);
}, [sellingProducts]);
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
            <Card title={'Traslados'} colorCard={'purple'} link={'/lastTransactions'} paragraph={'Ver movimientos'} />
            <Card title={'Mejores Productos'} colorCard={'#00b4ff'} paragraph={'100 mejores'} link={'/bestProducts'}/>
            <Card title={'Stock bajo'} colorCard={'orange'} paragraph={'Ver stock bajo'} link={'/stockLow'}/>
            {/* <Card title={'Producto Vendido'} colorCard={'#00b4ff'} link={''}/> */}

        </div>
            <Product_Card title={`Productos populares (${sellIdx + 1}/${sellingProducts.length || 0})`}
                description={sellingProducts.length ? sellingProducts[sellIdx]?.producto || 'No hay datos' : 'No hay datos'}
                icon={<StarIcon/>} link={'/lastBestProducts'} productosImg={sellingProducts[sellIdx]?.img || noImagen}/>
            <Product_Card title={`Lista de Compras (${shopIdx + 1}/${shoppingItems.length || 0})`}
                description={shoppingItems.length ? `${shoppingItems[shopIdx]?.product_name || ''} - Stock: ${shoppingItems[shopIdx]?.total_stock ?? 0}` : 'Sin productos en la lista'}
                icon={<AlarmIcon/>} link={'/shoppingList'} productosImg={shoppingItems[shopIdx]?.url_image || noImagen}/>
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
            
            <Footer_Card image={home} title={'Dashboard'} link={'/home'} />
            <Footer_Card image={ventas} title={'Ventas'} link={'/searchSales'} />
            <Footer_Card image={inventario} title={'Inventario'} link={'/inventory'} />
            <Footer_Card image={movimientos} title={'Movimientos'} link={'/lastTransactions'} />
            <Footer_Card image={alerta} title={'Comprar'} link={'/shoppingList'}/>

        </footer>
        </>
        
    )
}