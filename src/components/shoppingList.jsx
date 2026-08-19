import { useState, useEffect, useContext } from "react";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { ButtonSave, SearchInput } from "./form/inputSearch";
import shoppingService from "../services/shoppingList";
import { ContextUser } from "../context/userContext.jsx";
import axios from "axios";
import noImagen from "./img/no_imagen.png";
import { ProductModal } from "./form/productModal.jsx";

export const ShoppingList = ({ urlBase }) => {
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const { usuario } = useContext(ContextUser)
  const canEdit = usuario.role === 'admin'

  const loadList = async () => {
    try {
      const response = await shoppingService.getList(urlBase);
      setItems(response);
    } catch (error) {
      console.error("Error al obtener la lista de compras:", error);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadStock = async () => {
      if (selectedProduct && selectedProduct.id_product) {
        try {
          const { data } = await axios.get(`${urlBase}/api/v1/existence?product=${selectedProduct.id_product}`);
          if (isActive) {
            const total = data.reduce((acc, row) => acc + parseFloat(row.amount || 0), 0);
            setSelectedStock(total);
          }
        } catch (error) {
          console.error("Error al obtener el stock:", error);
          if (isActive) setSelectedStock(null);
        }
      } else if (isActive) {
        setSelectedStock(null);
      }
    };
    loadStock();
    return () => { isActive = false; };
  }, [selectedProduct, urlBase]);

  const addManual = async () => {
    if (!selectedProduct) {
      alert("Busca y selecciona un producto");
      return;
    }
    const response = await shoppingService.addManual(urlBase, selectedProduct.id_product);
    alert(response.message);
    setSelectedProduct(null);
    loadList();
  };

  const markPurchased = async (id_shopping) => {
    await shoppingService.markPurchased(urlBase, id_shopping);
    loadList();
  };

  const removeItem = async (id_shopping) => {
    await shoppingService.remove(urlBase, id_shopping);
    loadList();
  };

  const handleDragStart = (index) => { setDragIndex(index) }
  const handleDragOver = (e, index) => { e.preventDefault(); setDragOverIndex(index) }
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null) }

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(index, 0, moved);
      setItems(reordered);
      const orderedIds = reordered.map((item) => item.id_shopping);
      shoppingService.reorder(urlBase, orderedIds).catch((error) => {
        console.error("Error al guardar el orden:", error);
        loadList();
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <TitleForm text='Lista de Compras'></TitleForm>

      {canEdit ? (
      <div className="divForm">
        <h3>Agregar producto a mano</h3>
        <SearchInput urlApi={`${urlBase}/api/v1/products`} funcSet={setSelectedProduct} place="Buscar producto..."/>
        {selectedProduct ? (
          <div className="descriptionSell">
            <div className="image_box">
              <img
                className="product_image"
                src={selectedProduct.url_image ? selectedProduct.url_image : noImagen}
                alt={selectedProduct.name}
              />
            </div>
            <div>
              <p>{selectedProduct.name}</p>
              <p className="unitPrice">Stock total: {selectedStock !== null ? selectedStock : "Cargando..."}</p>
            </div>
          </div>
        ) : null}
        <ButtonSave titulo={'Agregar a la lista'} func={addManual}/>
      </div>
      ) : null}

      <h3>Productos por adquirir</h3>
      {canEdit ? <p>Arrastra las filas para cambiar la prioridad (las agregadas a mano van arriba por defecto)</p> : null}
      <div className="result">
      <table className="infoTable">
        <thead>
          <tr>
            {canEdit ? <th></th> : null}
            <th>Producto</th>
            <th>Stock total</th>
            <th>Costo S/.</th>
            {canEdit ? <th>Acciones</th> : null}
            <th>Origen</th>
            <th>Agregado por</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id_shopping}
              draggable={canEdit}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                opacity: dragIndex === index ? 0.4 : 1,
                cursor: canEdit ? 'grab' : 'default',
                borderTop: dragOverIndex === index ? '3px solid #4f86c6' : '',
              }}
            >
              {canEdit ? <td>≡</td> : null}
              <td>{item.product_name}</td>
              <td>{item.total_stock}</td>
              <td>{item.cost}</td>
              
              {canEdit ? (
              <td>
                <button onClick={() => markPurchased(item.id_shopping)}>Comprado</button>
                <button onClick={() => removeItem(item.id_shopping)}>Eliminar</button>
              </td>
              ) : null}
              <td>{item.source === 'auto' ? 'Automático' : 'Manual'}</td>
              <td>{item.added_by}</td>
              <td><button onClick={() => setViewItem(item)}>Ver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {viewItem ? <ProductModal product={viewItem} onClose={() => setViewItem(null)} /> : null}
    </>
  );
};