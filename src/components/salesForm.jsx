import { useState, useEffect } from "react";
import { InputSimple, SelectSimple, ParrafoInput, ButtonSave } from "./form/inputSearch";
import axios from "axios";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet } from "./table.jsx";
import { SalesService } from "../services/sales.js";
import noImagen from "./img/no_imagen.png";
const saleService = new SalesService()

export const SelesForm = ({ urlBase }) => {
  const [query, setQuery] = useState("");
  // Array con todos los productos
  const [suggestions, setSuggestions] = useState([]);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(1);
  const [cost, setCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [PUnit, setPUnit] = useState(0);
  const [dateSell, setDateSell] = useState('');
  const [dataCustomer, setDataCustomer] = useState('');
  const [idUser, setIdUser] = useState(1);
  const [idBranch, setIdBranch] = useState(1);
  const [show, setShow] = useState(false)
  const [showSales, SetShowSales] = useState(true)
  const [textButton, SetTextButton] = useState('Guardar')
  const [allProducts, setAllProducts] = useState([]);
 // const [selectColorUser, SetSelectColorUser] = useState('green');
 // const [selectColorBranch, SetSelectColorBranch] = useState('#009688');
  const [tableColor, setTableColor] = useState('white');




  useEffect(() => {
    // Simula la carga de todos los productos al inicio
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          `${urlBase}/api/v1/products`);
        setAllProducts(response.data);
        console.log("fetch listo");
      } catch (error) {
        console.error("Error al obtener todos los productos:", error);
      }
    };
    fetchAllProducts()

  }, [])

  useEffect(() => {
    // Filtra los nombres localmente en base a la query
    const filteredNames = allProducts
      .filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) &&
        query !== ""
      )
      .map((product) => {
        // Resalta las letras coincidentes
        const index = product.name.toLowerCase().indexOf(query.toLowerCase());
        const start = product.name.substring(0, index);
        const match = product.name.substring(index, index + query.length);
        const end = product.name.substring(index + query.length);
        return (
          <span key={product.id_product}>
            {start}
            <strong>{match}</strong>
            {end}
          </span>
        );
      });
    setSuggestions(filteredNames);
  }, [query, allProducts]);

  useEffect(() => {
    setPUnit(total / count);
  }, [count, total]);

  useEffect(() => {
    const value = ((PUnit - cost) * count).toFixed(2)
    setRevenue(value)

    // no funciona aun
    if (value < 0) {
      setTableColor('red')
    }
    else {
      setTableColor('white')
    }
  }, [PUnit]);

  const handleCount = ({ target: { value } }) => {
    const valueCount = parseInt(value)
    setCount(valueCount)
    if (valueCount < 0) {

    } else {

    }

  };
  const handleTotal = ({ target: { value } }) => { setTotal(parseFloat(value)) };
  const handleChange = (e) => { setQuery(e.target.value), setShow(false), SetShowSales(false) }
  const handleDate = (e) => { setDateSell(e.target.value) }

  // const handleIdUser = (e) => {
  //   const value = parseInt(e.target.value)
  //   setIdUser(value)
  //   if (value === 1) {
  //     SetSelectColorUser('green')
  //   }
  //   if (value === 2) {
  //     SetSelectColorUser('orangered')
  //   }
  //   if (value === 3) {
  //     SetSelectColorUser('yellow')
  //   }
  // }

  // const handleIdBranch = (e) => {
  //   const value = parseInt(e.target.value)
  //   setIdBranch(value)
  //   if (value === 1) {
  //     SetSelectColorBranch('#009688')
  //   }
  //   if (value === 3) {
  //     SetSelectColorBranch('#ff9800')
  //   }
  //   if (value === 4) {
  //     SetSelectColorBranch('#795548')
  //   }
  //   if (value === 7) {
  //     SetSelectColorBranch('#673ab7')
  //   }
  //   if (value === 5) {
  //     SetSelectColorBranch('#4d589a')
  //   }
  //   if (value === 6) {
  //     SetSelectColorBranch('#c061d1')
  //   }
  // }


  const changeCostumer = (e) => { setDataCustomer(e.target.value) }
  const handleClick = (event) => {
    const textoLi = event.target.textContent
    allProducts.forEach((elem) => {
      if (elem.name == textoLi) {
        setSuggestions([]);
        setProduct(elem);
        setCost(elem.cost);
        setQuery('')
        setShow(true)
        SetTextButton('Guardar')
      }
    });
  };


  const handleButton = () => {

    if (dateSell != '' && revenue > 0 && count > 0 && product.name != undefined) {
      const body = { dateSell, count, total, PUnit, revenue, dataCustomer, product, idUser, idBranch }
      const upload = saleService.register(urlBase, body)
      SetShowSales(true)
      alert('Felicidades...Venta Registrada!')
    } else {
      if (dateSell === '') {
        alert('No hay una fecha seleccionada!')
      }
      if (revenue < 0) {
        alert('Esta venta es a perdida, por lo cual no se puede registrar!')
      } if (count < 0) {
        alert('Cantidad debe ser mayor que cero')
      } if (product.name === undefined) {
        alert('la selección del producto es incorrecta')
      }

    }
  };

  return (
    <>
      <TitleForm text='Registrar Venta'></TitleForm>
      <input type="text" className="only_input" value={query} onChange={handleChange} placeholder="Buscar..." />
      <ul className="suggestions_lu">   {suggestions.map((suggestion, index) => (
        <li key={index} onClick={handleClick}>
          {suggestion}
        </li>
      ))}
      </ul>

      <div className="divForm">
        <div className="inputs_form">
          


        </div>
        <div className="inputs_form">

          
          
        </div>

      </div>

      <div className="descriptionSell">
      <div className="image_box">
      <img className="product_image" src={product.url_image ? product.url_image : noImagen} ></img>

      </div>
      <div>
      
        <p>{product.name} </p>
        <div className="dataSell">
                  <h4>Cant</h4>
                  <input type="number" onChange={handleCount} style={{ 'width': '45px' }} />
                </div>
                <div className="dataSell">
                  <h4>P.T.</h4>
                  <input type="number" onChange={handleTotal} style={{ 'width': '45px' }} />
                </div>
                <p className="unitPrice">{`Precio Unitario: S/.${(PUnit).toFixed(2)}`}</p>       
      </div>
      </div>
      <div className="selectsBox">

      <div>
            <h3>Fecha</h3>
            <input type="date" onChange={handleDate} className="registrationDate" placeholder="Fecha" required />
          </div>
      <div className="selectSimple">
            <h3>Usuario</h3>
            <select  name="listSelect" className='only_select'>
              <option value="1">Dennis</option>
              <option value="2">Luz</option>
              <option value="3">Miguel</option>
            </select>
          </div>     
          <div className="selectSimple">
            <h3>Sucursal</h3>
            <select  name="listSelect"  className='only_select'>
              <option value="1">B17</option>
              <option value="3">Departamento</option>
              <option value="4">Deposito</option>
              <option value="7">Tambopata</option>
              <option value="5">Los Nogales</option>
              <option value="6">Los Incas</option>
            </select>
          </div>    
      </div>
      <input type="text" onChange={changeCostumer} placeholder="Cliente"/>
       <div className="summarySell">
        <p>{`Productos (${count}) x (${PUnit}): `}</p>
        <p>{`S/.${(total).toFixed(2)}`}</p>
        </div> 
        <div className="summarySell">
        <p>Ganancia:</p>
        <p>{`S/.${revenue}`}</p>
        </div>       
        <div className="summarySell">
        <p>Costo:</p>
        <p>{`S/.${(cost)}`}</p>
        </div>  
        <div className="summarySell">
        <p>Actualizado:</p>
        <p>{(product.updated ? (product.updated.slice(0, 10)) : product.updated)}</p>
        </div>  
      {/* <div className="result">
        <table className="infoTable" >
          <thead>
            <tr>
              <th>Foto</th>
              <th>Datos</th>
              <th>Articulo</th>
              <th>Resultado</th>
              <th>F. Modif</th>

            </tr>
          </thead>
          <tbody >
            <tr style={{ backgroundColor: tableColor }}>
              <td style={{ 'width': '105px' }}><img className="product_image" src={product.url_image ? product.url_image : noImagen} ></img></td>
              <td style={{ 'width': '110px' }}>
                <div className="dataSell">
                  <h4>Cant</h4>
                  <input type="number" onChange={handleCount} style={{ 'width': '45px' }} />
                </div>
                <div className="dataSell">
                  <h4>P.U.</h4>
                  <p>{`S/.${(PUnit).toFixed(2)}`}</p>
                </div>
                <div className="dataSell">
                  <h4>P.T.</h4>
                  <input type="number" onChange={handleTotal} style={{ 'width': '45px' }} />
                </div>

              </td>

              <td className="td_description" style={{ 'width': '100px' }} >
                <p style={{ 'width': '35px' }}>{product.name} </p>
              </td>
              <td className="td_result" style={{ 'width': '150px' }} >

                <h4>Costo</h4>
                <p>{`S/.${cost}`}</p>
                <h4>Ganancia</h4>
                <p>{`S/.${revenue}`}</p>
              </td>

              <td className="td_modif" style={{ 'width': '150px' }} >
                <h4>Actualizado:</h4>
                <p>{(product.updated ? (product.updated.slice(0, 10)) : product.updated)}</p>
                <h4>Creado:</h4>
                <p>{(product.created ? product.created.slice(0, 10) : product.created)}</p></td>

            </tr>

          </tbody>
        </table>
      </div> */}
      <button onClick={handleButton} className="saveSell">Guardar</button>

      <h3>Stock</h3>
      {<>{show ? <TableGet url={`${urlBase}/api/v1/existence?product=${product.id_product}`} /> : <></>
      }</>}
      <h3>Ultimas Ventas</h3>

      {<>{showSales ? <TableGet url={`${urlBase}/api/v1/ventas`} /> : <></>
      }</>}





    </>
  );
};
